import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { createActionQueue } from "./createActionQueue.ts";

describe("createActionQueue", () => {
  it("runs synchronously while nothing is pending", async () => {
    const enqueue = createActionQueue(Promise.resolve(), () => {});
    await delay(0);
    const ran: string[] = [];

    enqueue(() => {
      ran.push("a");
      return undefined;
    });

    assert.deepEqual(ran, ["a"]);
  });

  it("runs behind pending work, in order", async () => {
    const enqueue = createActionQueue(Promise.resolve(), () => {});
    await delay(0);
    const ran: string[] = [];

    enqueue(async () => {
      await delay(10);
      ran.push("refetch");
    });
    enqueue(() => {
      ran.push("next");
      return undefined;
    });

    assert.equal(ran.length, 0);
    await delay(30);
    assert.deepEqual(ran, ["refetch", "next"]);

    enqueue(() => {
      ran.push("idle again");
      return undefined;
    });
    assert.deepEqual(ran, ["refetch", "next", "idle again"]);
  });

  it("waits for the initial work", async () => {
    const enqueue = createActionQueue(delay(10), () => {});
    const ran: string[] = [];

    enqueue(() => {
      ran.push("a");
      return undefined;
    });

    assert.equal(ran.length, 0);
    await delay(30);
    assert.deepEqual(ran, ["a"]);
  });

  it("reports failures of actions, not of the initial work, and goes on", async () => {
    const errors: unknown[] = [];
    const enqueue = createActionQueue(
      Promise.reject(new Error("initial")),
      (error) => errors.push(error),
    );
    await delay(0);

    enqueue(() => {
      throw new Error("sync");
    });
    enqueue(() => Promise.reject(new Error("async")));
    await delay(0);
    const ran: string[] = [];
    enqueue(() => {
      ran.push("after");
      return undefined;
    });
    await delay(0);

    assert.deepEqual(
      errors.map((error) => (error as Error).message),
      ["sync", "async"],
    );
    assert.deepEqual(ran, ["after"]);
  });
});
