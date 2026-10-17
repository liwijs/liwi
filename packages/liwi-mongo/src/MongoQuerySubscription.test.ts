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

  it("refetches on resync", async () => {
    const { received } = await subscribe(createItemQuery());

    store.resync();
    await settle();

    assert.equal(received.length, 1);
    assert.equal(received[0]![0]!.type, "initial");
  });
});
