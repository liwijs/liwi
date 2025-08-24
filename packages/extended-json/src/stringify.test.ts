import assert from "node:assert/strict";
import { test } from "node:test";
import stringify from "./stringify.ts";

test("simple string", () => {
  assert.equal(stringify("test"), '"test"');
});

test("Date", () => {
  assert.equal(stringify(new Date("2016-12-24")), '"2016-12-24T00:00:00.000Z"');
});
