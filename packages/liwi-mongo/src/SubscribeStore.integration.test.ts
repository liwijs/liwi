import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import type { Changes } from "liwi-store";
import { NotFoundError, ProtectedFieldUpdateError } from "liwi-store";
import type { Actions } from "liwi-subscribe-store";
import type { MongoMemoryServer } from "mongodb-memory-server-core";
import type { MongoBaseModel } from "./MongoBaseModel.ts";
import MongoConnection from "./MongoConnection.ts";
import MongoStore from "./MongoStore.ts";
import createMongoSubscribeStore from "./createMongoSubscribeStore.ts";

interface Item extends MongoBaseModel {
  label: string;
  flag: boolean;
  note?: string | null;
  __v?: number;
}

describe(
  "SubscribeStore over MongoStore (integration)",
  {
    skip: !process.env.LIWI_MONGO_INTEGRATION && "set LIWI_MONGO_INTEGRATION=1",
    timeout: 120_000,
  },
  () => {
    let mongod: MongoMemoryServer;
    let connection: MongoConnection;
    let mongoStore: MongoStore<Item>;
    let subscribeStore: ReturnType<typeof createMongoSubscribeStore<Item>>;
    let actions: Actions<Item>[];

    before(async () => {
      const { MongoMemoryServer: MemoryServer } =
        await import("mongodb-memory-server-core");
      mongod = await MemoryServer.create();
      connection = new MongoConnection({
        host: "127.0.0.1",
        port: mongod.instanceInfo!.port,
        database: "liwi-mongo-subscribe-store-test",
      });
      await connection.getConnection();
      mongoStore = new MongoStore<Item>(connection, "items");
    });

    after(async () => {
      await connection.close();
      await mongod.stop();
    });

    beforeEach(async () => {
      await mongoStore.deleteMany({});
      subscribeStore = createMongoSubscribeStore(mongoStore);
      await subscribeStore.insertOne({ _id: "1", label: "a", flag: true });
      actions = [];
      subscribeStore.subscribe((action) => actions.push(action));
    });

    const loadStored = async (): Promise<Item> =>
      (await mongoStore.findByKey("1"))!;

    it("emits the stored prev on partialUpdateOne of a mutated copy", async () => {
      const stored = await loadStored();
      const copy: Item = { ...stored, label: "mutated locally" };

      const next = await subscribeStore.partialUpdateOne(copy, {
        $set: { flag: false },
      });

      assert.deepEqual(next, { ...stored, flag: false, updated: next.updated });
      assert.deepEqual(actions, [
        { type: "updated", changes: [[stored, next]] },
      ]);
    });

    it("emits the stored prev on replaceOne of a stale copy", async () => {
      const stale = await loadStored();
      await mongoStore.partialUpdateByKey("1", { $set: { label: "b" } });
      const stored = await loadStored();

      const next = await subscribeStore.replaceOne({ ...stale, flag: false });

      assert.notEqual(next, stale);
      assert.deepEqual(actions, [
        { type: "updated", changes: [[stored, next]] },
      ]);
      assert.deepEqual(await loadStored(), next);
    });

    it("emits the stored prev on deleteOne of a stale copy", async () => {
      const stale = await loadStored();
      await mongoStore.partialUpdateByKey("1", { $set: { label: "b" } });
      const stored = await loadStored();

      await subscribeStore.deleteOne(stale);

      assert.deepEqual(actions, [{ type: "deleted", prev: [stored] }]);
      assert.equal(await mongoStore.findByKey("1"), undefined);
    });

    it("removes a document from a query collection when replaceOne makes it leave the criteria", async () => {
      const received: Changes<string, Item[]>[] = [];
      const query = subscribeStore.createQueryCollection<Item, never>({
        criteria: { flag: true },
      });
      await query.subscribe((error, changes) => {
        if (error) throw error;
        received.push(changes);
      });

      const copy = await loadStored();
      copy.flag = false;
      await subscribeStore.replaceOne(copy);

      assert.deepEqual(received, [[{ type: "deleted", keys: ["1"] }]]);
    });

    it("emits nothing for writes on a missing key", async () => {
      await assert.rejects(
        subscribeStore.partialUpdateByKey("missing", { $set: { label: "x" } }),
        NotFoundError,
      );
      await assert.rejects(
        subscribeStore.replaceOne({ ...(await loadStored()), _id: "missing" }),
        NotFoundError,
      );
      await subscribeStore.deleteByKey("missing");

      assert.deepEqual(actions, []);
    });

    it("treats a key that no longer matches the criteria as missing", async () => {
      await assert.rejects(
        subscribeStore.partialUpdateByKey(
          "1",
          { $set: { label: "x" } },
          { flag: false },
        ),
        NotFoundError,
      );
      await subscribeStore.deleteByKey("1", { flag: false });

      const stored = await loadStored();
      assert.deepEqual(actions, []);
      assert.equal(stored.label, "a");
    });

    describe("bulk writes with a concurrent write between the key read and the writes", () => {
      // runs `inject` right before the first per-document write, after the keys were read
      const subscribeInjecting = (
        inject: () => Promise<unknown>,
      ): {
        injectingSubscribeStore: ReturnType<
          typeof createMongoSubscribeStore<Item>
        >;
        emitted: Actions<Item>[];
      } => {
        let isInjected = false;
        const injectOnce = async (): Promise<void> => {
          if (isInjected) return;
          isInjected = true;
          await inject();
        };
        const injectingStore: MongoStore<Item> = Object.assign(
          Object.create(mongoStore) as MongoStore<Item>,
          {
            partialUpdateByKeyWithInfo: async (
              ...args: Parameters<
                MongoStore<Item>["partialUpdateByKeyWithInfo"]
              >
            ) => {
              await injectOnce();
              return mongoStore.partialUpdateByKeyWithInfo(...args);
            },
            deleteByKeyWithInfo: async (
              ...args: Parameters<MongoStore<Item>["deleteByKeyWithInfo"]>
            ) => {
              await injectOnce();
              return mongoStore.deleteByKeyWithInfo(...args);
            },
          },
        );
        const injectingSubscribeStore =
          createMongoSubscribeStore(injectingStore);
        const emitted: Actions<Item>[] = [];
        injectingSubscribeStore.subscribe((action) => emitted.push(action));
        return { injectingSubscribeStore, emitted };
      };

      const injectConcurrentWrites = async (): Promise<void> => {
        await mongoStore.partialUpdateByKey("2", { $set: { flag: false } });
        await mongoStore.insertOne({ _id: "4", label: "late", flag: true });
      };

      beforeEach(async () => {
        await mongoStore.insertOne({ _id: "2", label: "b", flag: true });
        await mongoStore.insertOne({ _id: "3", label: "c", flag: false });
      });

      it("deleteMany emits exactly the documents it deleted", async () => {
        const stored1 = await loadStored();
        const { injectingSubscribeStore, emitted } = subscribeInjecting(
          injectConcurrentWrites,
        );

        await injectingSubscribeStore.deleteMany({ flag: true });

        const remaining = await mongoStore.findAll({}, { _id: 1 });
        assert.deepEqual(
          remaining.map(({ _id }) => _id),
          ["2", "3", "4"],
        );
        assert.deepEqual(emitted, [{ type: "deleted", prev: [stored1] }]);
      });

      it("partialUpdateMany emits exactly the documents it updated, with their true prev", async () => {
        const stored1 = await loadStored();
        const { injectingSubscribeStore, emitted } = subscribeInjecting(
          injectConcurrentWrites,
        );

        await injectingSubscribeStore.partialUpdateMany(
          { flag: true },
          { $set: { label: "bulk" } },
        );

        const documents = await mongoStore.findAll({}, { _id: 1 });
        assert.deepEqual(
          documents.map(({ _id, label }) => [_id, label]),
          [
            ["1", "bulk"],
            ["2", "b"],
            ["3", "c"],
            ["4", "late"],
          ],
        );
        assert.deepEqual(emitted, [
          { type: "updated", changes: [[stored1, documents[0]]] },
        ]);
      });
    });

    describe("write metadata", () => {
      const oldCreated = new Date("2019-01-01");
      const oldUpdated = new Date("2020-01-01");

      const resetOld = async (): Promise<Item> => {
        await mongoStore.deleteByKey("old");
        return mongoStore.insertOne({
          _id: "old",
          label: "old",
          flag: true,
          created: oldCreated,
          updated: oldUpdated,
        });
      };

      const loadOld = async (): Promise<Item> =>
        (await mongoStore.findByKey("old"))!;

      const writes: [string, (old: Item) => Promise<unknown>][] = [
        [
          "MongoStore.partialUpdateByKey",
          () => mongoStore.partialUpdateByKey("old", { $set: { label: "x" } }),
        ],
        [
          "SubscribeStore.partialUpdateOne",
          (old) =>
            subscribeStore.partialUpdateOne(old, { $set: { label: "x" } }),
        ],
        [
          "MongoStore.partialUpdateMany",
          () =>
            mongoStore.partialUpdateMany({ _id: "old" }, { $inc: { __v: 1 } }),
        ],
        [
          "SubscribeStore.partialUpdateMany",
          () =>
            subscribeStore.partialUpdateMany(
              { _id: "old" },
              { $set: { label: "x" } },
            ),
        ],
        [
          "MongoStore.replaceOne with a loaded document",
          (old) => mongoStore.replaceOne({ ...old, label: "x" }),
        ],
        [
          "SubscribeStore.replaceOne with another created",
          (old) =>
            subscribeStore.replaceOne({
              ...old,
              created: new Date("2025-01-01"),
            }),
        ],
        [
          "upsertOne without updated",
          () =>
            subscribeStore.upsertOne({ _id: "old", label: "x", flag: false }),
        ],
      ];

      for (const [name, write] of writes) {
        it(`${name} moves updated forward and keeps created`, async () => {
          const old = await resetOld();
          const writeStart = Date.now();

          await write(old);

          const stored = await loadOld();
          assert.ok(stored.updated.getTime() >= writeStart);
          assert.deepEqual(stored.created, oldCreated);
        });
      }

      it("keeps updated with touchUpdated: false", async () => {
        await resetOld();

        await mongoStore.partialUpdateMany(
          { _id: "old" },
          { $set: { label: "backfill" } },
          { touchUpdated: false },
        );
        await subscribeStore.partialUpdateByKey(
          "old",
          { $set: { flag: false } },
          undefined,
          { touchUpdated: false },
        );

        const stored = await loadOld();
        assert.deepEqual(stored.updated, oldUpdated);
        assert.equal(stored.label, "backfill");
      });

      it("stores an explicit updated set by the caller", async () => {
        await resetOld();
        const callerTime = new Date("2024-06-01");

        const afterSet = await mongoStore.partialUpdateByKey("old", {
          $set: { updated: callerTime },
        });
        assert.deepEqual(afterSet.updated, callerTime);

        const afterMax = await mongoStore.partialUpdateByKey("old", {
          $max: { updated: new Date("2024-01-01") },
        });
        assert.deepEqual(afterMax.updated, callerTime);

        const writeStart = Date.now();
        const afterCurrentDate = await mongoStore.partialUpdateByKey("old", {
          $currentDate: { updated: true },
        });
        // $currentDate uses the mongod clock; allow for a small skew with this process
        assert.ok(afterCurrentDate.updated.getTime() >= writeStart - 1000);
      });

      it("rejects protected field updates before mongo sees them", async () => {
        await resetOld();
        const forbidden: Record<string, unknown>[] = [
          { $set: { created: new Date() } },
          { $unset: { updated: true } },
          { $inc: { updated: 1 } },
          { $min: { updated: new Date() } },
          { $setOnInsert: { updated: new Date() } },
          { $rename: { updated: "lastUpdate" } },
          { $rename: { label: "created" } },
        ];

        for (const update of forbidden) {
          await assert.rejects(
            mongoStore.partialUpdateByKey("old", update),
            ProtectedFieldUpdateError,
            JSON.stringify(update),
          );
        }

        const stored = await loadOld();
        assert.deepEqual(stored.updated, oldUpdated);
        assert.deepEqual(stored.created, oldCreated);
      });

      it("stores replacement values starting with $ as data", async () => {
        const old = await resetOld();

        const replaced = await mongoStore.replaceOne({
          ...old,
          label: "$label",
        });
        assert.equal(replaced.label, "$label");

        await subscribeStore.replaceOne({
          ...old,
          flag: false,
          label: "$flag",
        });
        const stored = await loadOld();
        assert.equal(stored.label, "$flag");
      });

      it("returns the upserted next as stored, undefined values included", async () => {
        await resetOld();

        const result = await mongoStore.upsertOneWithInfo({
          _id: "old",
          label: "x",
          flag: false,
          note: undefined,
        });

        assert.deepEqual(result.object, await loadOld());
      });
    });
  },
);
