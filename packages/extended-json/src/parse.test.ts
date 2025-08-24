import assert from "node:assert/strict";
import { test } from "node:test";
import parse from "./parse.ts";

test("simple string", () => {
  assert.equal(parse('"test"'), "test");
});

test("Date", () => {
  const date = parse('"2016-12-24T00:00:00.000Z"');
  assert.ok(date instanceof Date);
  assert.equal(date.getTime(), new Date("2016-12-24").getTime());
});
