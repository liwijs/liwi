import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ProtectedFieldUpdateError } from "liwi-store";
import type { Update } from "liwi-store";
import type { MongoBaseModel } from "../MongoBaseModel.ts";
import { stampPartialUpdate } from "./stampPartialUpdate.ts";

interface TestModel extends MongoBaseModel {
  label: string;
  count: number;
}

const now = new Date("2026-10-11T10:00:00Z");
const callerTime = new Date("2026-01-01");

const stamp = (update: Record<string, unknown>): Update<TestModel> =>
  stampPartialUpdate(update as Update<TestModel>, now);

describe("stampPartialUpdate", () => {
  it("adds updated to $set", () => {
    assert.deepEqual(stamp({ $set: { label: "a" }, $inc: { count: 1 } }), {
      $set: { label: "a", updated: now },
      $inc: { count: 1 },
    });
  });

  it("adds a $set when the update has none", () => {
    assert.deepEqual(stamp({ $inc: { count: 1 } }), {
      $inc: { count: 1 },
      $set: { updated: now },
    });
  });

  it("does not stamp without a write time", () => {
    const update: Update<TestModel> = { $set: { label: "a" } };

    assert.equal(stampPartialUpdate(update, undefined), update);
  });

  it("does not mutate the caller's update", () => {
    const update = { $set: { label: "a" } };

    stamp(update);

    assert.deepEqual(update, { $set: { label: "a" } });
  });

  for (const update of [
    { $set: { updated: callerTime } },
    { $currentDate: { updated: true } },
    { $max: { updated: callerTime } },
  ]) {
    it(`lets the caller set updated with ${Object.keys(update)[0]!}`, () => {
      assert.equal(stamp(update), update);
    });
  }

  for (const update of [
    { $unset: { updated: true } },
    { $inc: { updated: 1 } },
    { $mul: { updated: 2 } },
    { $min: { updated: callerTime } },
    { $setOnInsert: { updated: callerTime } },
    { $rename: { updated: "lastUpdate" } },
    { $rename: { lastUpdate: "updated" } },
    { $push: { updated: callerTime } },
    { $set: { "updated.day": 1 } },
  ]) {
    it(`rejects ${JSON.stringify(update)}`, () => {
      assert.throws(() => stamp(update), ProtectedFieldUpdateError);
    });
  }

  for (const update of [
    { $set: { created: callerTime } },
    { $currentDate: { created: true } },
    { $max: { created: callerTime } },
    { $unset: { created: true } },
    { $rename: { created: "creation" } },
    { $rename: { creation: "created" } },
    { $set: { "created.day": 1 } },
  ]) {
    it(`rejects ${JSON.stringify(update)}`, () => {
      assert.throws(() => stamp(update), ProtectedFieldUpdateError);
    });
  }

  it("ignores fields that only start like a protected field", () => {
    assert.deepEqual(stamp({ $set: { updatedBy: "bot", createdBy: "bot" } }), {
      $set: { updatedBy: "bot", createdBy: "bot", updated: now },
    });
  });
});
