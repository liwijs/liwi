import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import type { Changes, QuerySubscription } from "liwi-store";
import type { MongoBaseModel } from "./MongoBaseModel.ts";
import MongoConnection from "./MongoConnection.ts";
import MongoStore from "./MongoStore.ts";
import createMongoSubscribeStore from "./createMongoSubscribeStore.ts";
import { createMemoryMongoClient } from "./memory/createMemoryMongoClient.ts";

interface Item extends MongoBaseModel {
  group: string;
  rank: number;
}

let mongoStore: MongoStore<Item>;
let store: ReturnType<typeof createMongoSubscribeStore<Item>>;

beforeEach(async () => {
  const connection = new MongoConnection({
    client: createMemoryMongoClient().client,
  });
  mongoStore = new MongoStore<Item>(connection, "items");
  store = createMongoSubscribeStore(mongoStore);
  await mongoStore.insertOne({ _id: "1", group: "a", rank: 1 });
  await mongoStore.insertOne({ _id: "2", group: "a", rank: 2 });
  await mongoStore.insertOne({ _id: "3", group: "b", rank: 3 });
});

/** lets the subscription's serial queue run */
const settle = (): Promise<void> => delay(10);

const subscribe = async <Result>(query: {
  fetchAndSubscribe: (
    callback: (
      error: Error | null,
      changes: Changes<string, Result>,
    ) => unknown,
  ) => QuerySubscription;
}): Promise<{
  received: Changes<string, Result>[];
  subscription: QuerySubscription;
}> => {
  const received: Changes<string, Result>[] = [];
  const subscription = query.fetchAndSubscribe((error, changes) => {
    if (error) throw error;
    received.push(changes);
  });
  await subscription;
  received.length = 0;
  return { received, subscription };
};

const withoutDates = <T>(value: T): T =>
  JSON.parse(
    JSON.stringify(value, (key, nested: unknown) =>
      key === "created" || key === "updated" ? undefined : nested,
    ),
  ) as T;

describe("MongoQueryCollection subscription", () => {
  const createGroupQuery = (limit?: number) =>
    store.createQueryCollection({
      criteria: { group: "a" },
      sort: { rank: 1 },
      limit,
    });

  it("removes a document another process moved out of the criteria", async () => {
    const { received } = await subscribe(createGroupQuery());

    await mongoStore.partialUpdateByKey("1", { $set: { group: "b" } });
    await store.notifyChanged(["1"]);
    await settle();

    assert.deepEqual(received, [[{ type: "deleted", keys: ["1"] }]]);
  });

  it("inserts a document another process brought in, then only updates it", async () => {
    const { received } = await subscribe(createGroupQuery());

    await mongoStore.partialUpdateByKey("3", { $set: { group: "a" } });
    await store.notifyChanged(["3"]);
    await store.notifyChanged(["3"]);
    await settle();

    assert.deepEqual(
      withoutDates(received),
      withoutDates([
        [
          {
            type: "inserted",
            result: [{ _id: "3", group: "a", rank: 3 }],
          },
        ],
        [{ type: "updated", result: [{ _id: "3", group: "a", rank: 3 }] }],
      ]),
    );
  });

  it("deletes a document deleted by another process once", async () => {
    const { received } = await subscribe(createGroupQuery());

    await mongoStore.deleteByKey("2");
    await store.notifyChanged(["2"]);
    await store.notifyChanged(["2"]);
    await settle();

    assert.deepEqual(received, [[{ type: "deleted", keys: ["2"] }]]);
  });

  it("ignores documents it does not hold and that do not match", async () => {
    const { received } = await subscribe(createGroupQuery());

    await mongoStore.partialUpdateByKey("3", { $set: { rank: 4 } });
    await store.notifyChanged(["3", "unknown"]);
    await settle();

    assert.deepEqual(received, []);
  });

  it("decides a local write from what it sent, not from the emitted prev", async () => {
    const { received } = await subscribe(createGroupQuery());
    const date = new Date();
    const unrelatedPrev: Item = {
      _id: "3",
      group: "b",
      rank: 3,
      created: date,
      updated: date,
    };
    const next: Item = {
      _id: "1",
      group: "b",
      rank: 1,
      created: date,
      updated: date,
    };

    store.callSubscribed({ type: "updated", changes: [[unrelatedPrev, next]] });
    await settle();

    assert.deepEqual(received, [[{ type: "deleted", keys: ["1"] }]]);
  });

  it("re-reads a notified document instead of trusting a stale notification", async () => {
    const { received } = await subscribe(createGroupQuery());
    const stale = (await mongoStore.findByKey("1"))!;

    await mongoStore.partialUpdateByKey("1", { $set: { group: "b" } });
    store.callSubscribed({ type: "changed", keys: ["1"], next: [stale] });
    await settle();

    assert.deepEqual(received, [[{ type: "deleted", keys: ["1"] }]]);
  });

  it("refetches when a document leaves a limited result", async () => {
    await mongoStore.partialUpdateByKey("3", { $set: { group: "a" } });
    const { received } = await subscribe(createGroupQuery(2));

    await mongoStore.deleteByKey("1");
    await store.notifyChanged(["1"]);
    await settle();

    assert.equal(received.length, 1);
    const [change] = received[0]!;
    assert.equal(change!.type, "initial");
    assert.deepEqual(
      change!.type === "initial" &&
        (change!.initial as Item[]).map((item) => item._id),
      ["2", "3"],
    );
  });

  it("refetches on resync", async () => {
    const { received } = await subscribe(createGroupQuery());

    await mongoStore.deleteByKey("1");
    store.resync();
    await settle();

    assert.equal(received.length, 1);
    const [change] = received[0]!;
    assert.equal(change!.type, "initial");
    assert.deepEqual(
      change!.type === "initial" &&
        (change!.initial as Item[]).map((item) => item._id),
      ["2"],
    );
  });

  it("sends nothing once stopped", async () => {
    const { received, subscription } = await subscribe(createGroupQuery());

    subscription.stop();
    await mongoStore.deleteByKey("1");
    await store.notifyChanged(["1"]);
    store.resync();
    await settle();

    assert.deepEqual(received, []);
  });
});

describe("MongoQuerySingleItem subscription", () => {
  const createItemQuery = () =>
    store.createQuerySingleItem({ criteria: { _id: "1" } });

  it("sends the re-read document when another process changed it", async () => {
    const { received } = await subscribe(createItemQuery());

    await mongoStore.partialUpdateByKey("1", { $set: { rank: 10 } });
    await store.notifyChanged(["1"]);
    await settle();

    assert.deepEqual(
      withoutDates(received),
      withoutDates([
        [{ type: "updated", result: { _id: "1", group: "a", rank: 10 } }],
      ]),
    );
  });

  it("sends null when another process deleted it", async () => {
    const { received } = await subscribe(createItemQuery());

    await mongoStore.deleteByKey("1");
    await store.notifyChanged(["1"]);
    await settle();

    assert.deepEqual(received, [[{ type: "updated", result: null }]]);
  });

  it("ignores other documents", async () => {
    const { received } = await subscribe(createItemQuery());

    await store.notifyChanged(["2"]);
    await settle();

    assert.deepEqual(received, []);
  });

  it("ignores the deletion of a document it does not show", async () => {
    const { received } = await subscribe(
      store.createQuerySingleItem({
        criteria: { group: "a" },
        sort: { rank: 1 },
      }),
    );

    await store.deleteByKey("2");
    await settle();

    assert.deepEqual(received, []);
  });

  it("reconciles a subscription without initial result when a write raced with its fetch", async () => {
    const received: Changes<string, { _id: string } | null>[] = [];
    const subscription = createItemQuery().subscribe((error, changes) => {
      if (error) throw error;
      received.push(changes);
    });

    await store.deleteByKey("1");
    await subscription;
    await settle();

    assert.ok(
      received.some((changes) => changes[0]?.type === "initial"),
      "the fetch result should be sent",
    );
  });

  it("refetches on resync", async () => {
    const { received } = await subscribe(createItemQuery());

    store.resync();
    await settle();

    assert.equal(received.length, 1);
    assert.equal(received[0]![0]!.type, "initial");
  });
});

describe("MongoQueryCollection subscription edge cases", () => {
  type ItemChanges = Changes<string, { _id: string }[]>;

  const getInitial = (
    changes: Changes<string, { _id: string }[]>,
  ): { ids: string[]; total: number } => {
    assert.equal(changes.length, 1);
    const [change] = changes;
    assert.equal(change!.type, "initial");
    if (change!.type !== "initial") throw new Error("unreachable");
    return {
      ids: change!.initial.map((item) => item._id),
      total: change!.meta.total,
    };
  };

  it("refetches when a document enters a limited result", async () => {
    const { received } = await subscribe(
      store.createQueryCollection({
        criteria: { group: "a" },
        sort: { rank: 1 },
        limit: 5,
      }),
    );

    await store.partialUpdateByKey("3", { $set: { group: "a" } });
    await settle();

    assert.equal(received.length, 1);
    assert.deepEqual(getInitial(received[0]!), {
      ids: ["1", "2", "3"],
      total: 3,
    });
  });

  it("refetches when a document before a skipped window leaves the criteria", async () => {
    const { received } = await subscribe(
      store.createQueryCollection({
        criteria: { group: "a" },
        sort: { rank: 1 },
        skip: 1,
      }),
    );

    await store.partialUpdateByKey("1", { $set: { group: "b" } });
    await settle();

    assert.equal(received.length, 1);
    assert.deepEqual(getInitial(received[0]!), { ids: [], total: 1 });
  });

  it("refetches on a write to a matching document past a limit", async () => {
    const { received } = await subscribe(
      store.createQueryCollection({
        criteria: { group: "a" },
        sort: { rank: 1 },
        limit: 1,
      }),
    );

    await store.partialUpdateByKey("2", { $set: { rank: 20 } });
    await settle();

    assert.equal(received.length, 1);
    assert.deepEqual(getInitial(received[0]!), { ids: ["1"], total: 2 });
  });

  it("refetches when a document past a limit leaves the criteria, for the total", async () => {
    const { received } = await subscribe(
      store.createQueryCollection({
        criteria: { group: "a" },
        sort: { rank: 1 },
        limit: 1,
      }),
    );

    await store.partialUpdateByKey("2", { $set: { group: "b" } });
    await settle();

    assert.equal(received.length, 1);
    assert.deepEqual(getInitial(received[0]!), { ids: ["1"], total: 1 });
  });

  it("does not refetch a limited result holding every match for an unrelated write", async () => {
    const { received } = await subscribe(
      store.createQueryCollection({
        criteria: { group: "a" },
        sort: { rank: 1 },
        limit: 5,
      }),
    );

    await store.partialUpdateByKey("3", { $set: { rank: 30 } });
    await settle();

    assert.deepEqual(received, []);
  });

  it("reconciles a subscription without initial result when a write raced with its fetch", async () => {
    const received: ItemChanges[] = [];
    const subscription = store
      .createQueryCollection({ criteria: { group: "a" } })
      .subscribe((error, changes) => {
        if (error) throw error;
        received.push(changes);
      });

    await store.deleteByKey("1");
    await subscription;
    await settle();

    const initial = received.find((changes) => changes[0]?.type === "initial");
    assert.ok(initial, "the fetch result should be sent");
    const initialIds = getInitial(initial).ids;
    assert.deepEqual(
      initialIds.includes("1") ? received.at(-1) : [],
      initialIds.includes("1") ? [{ type: "deleted", keys: ["1"] }] : [],
    );
  });

  it("keeps the last state when one action holds a key twice", async () => {
    const { received } = await subscribe(
      store.createQueryCollection({ criteria: { group: "a" } }),
    );
    const date = new Date();
    const held = (group: string): Item => ({
      _id: "1",
      group,
      rank: 1,
      created: date,
      updated: date,
    });
    const notHeld = (rank: number): Item => ({
      _id: "3",
      group: "a",
      rank,
      created: date,
      updated: date,
    });

    store.callSubscribed({
      type: "updated",
      changes: [
        [held("a"), held("a")],
        [held("a"), held("b")],
        [notHeld(3), notHeld(4)],
        [notHeld(4), notHeld(5)],
      ],
    });
    await settle();

    assert.deepEqual(withoutDates(received), [
      [
        { type: "deleted", keys: ["1"] },
        {
          type: "inserted",
          result: withoutDates([notHeld(5)]),
        },
      ],
    ]);
  });

  it("applies a write made during the initial fetch after the initial result", async () => {
    const received: ItemChanges[] = [];
    const subscription = store
      .createQueryCollection({ criteria: { group: "a" } })
      .fetchAndSubscribe((error, changes) => {
        if (error) throw error;
        received.push(changes);
      });

    await store.partialUpdateByKey("1", { $set: { group: "b" } });
    await subscription;
    await settle();

    assert.equal(received[0]![0]!.type, "initial");
    const initialIds = getInitial(received[0]!).ids;
    // the fetch may run before or after the write: either way, 1 ends removed
    if (initialIds.includes("1")) {
      assert.deepEqual(received.slice(1), [[{ type: "deleted", keys: ["1"] }]]);
    } else {
      assert.deepEqual(received.slice(1), []);
    }
  });

  it("takes the keys from transformed items", async () => {
    const { received } = await subscribe(
      store.createQueryCollection({
        criteria: { group: "a" },
        fields: { group: 1 },
        transformer: ({ _id, group }) => ({ _id, group }),
      }),
    );

    await mongoStore.partialUpdateByKey("1", { $set: { rank: 10 } });
    await mongoStore.partialUpdateByKey("2", { $set: { group: "b" } });
    await store.notifyChanged(["1", "2"]);
    await settle();

    assert.deepEqual(received, [
      [
        { type: "deleted", keys: ["2"] },
        { type: "updated", result: [{ _id: "1", group: "a" }] },
      ],
    ]);
  });

  it("sends nothing when stopped during a refetch", async () => {
    const { received, subscription } = await subscribe(
      store.createQueryCollection({ criteria: { group: "a" } }),
    );

    store.resync();
    subscription.stop();
    await settle();

    assert.deepEqual(received, []);
  });

  it("ignores writes after a failed initial fetch, until a resync succeeds", async () => {
    const query = store.createQueryCollection({ criteria: { group: "a" } });
    const fetch = query.fetch.bind(query);
    let fetchCount = 0;
    query.fetch = (onFulfilled) =>
      fetchCount++ === 0
        ? Promise.reject(new Error("initial failed"))
        : fetch(onFulfilled);
    const received: ItemChanges[] = [];

    await assert.rejects(
      Promise.resolve(
        query.fetchAndSubscribe((error, changes) => {
          if (error) throw error;
          received.push(changes);
        }),
      ),
      /initial failed/,
    );
    await store.partialUpdateByKey("3", { $set: { group: "a" } });
    await settle();
    assert.equal(received.length, 0);

    store.resync();
    await settle();

    assert.equal(received.length, 1);
    assert.deepEqual(getInitial(received[0]!), {
      ids: ["1", "2", "3"],
      total: 3,
    });
  });

  it("knows the held keys of a subscription opened without its initial result", async () => {
    const received: ItemChanges[] = [];
    await store
      .createQueryCollection({ criteria: { group: "a" } })
      .subscribe((error, changes) => {
        if (error) throw error;
        received.push(changes);
      });

    await mongoStore.partialUpdateByKey("1", { $set: { group: "b" } });
    await store.notifyChanged(["1"]);
    await settle();

    assert.deepEqual(received, [[{ type: "deleted", keys: ["1"] }]]);
  });
});
