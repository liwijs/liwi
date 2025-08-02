import stringify from "./stringify.ts";

test("simple string", () => {
  expect(stringify("test")).toBe('"test"');
});

test("Date", () => {
  expect(stringify(new Date("2016-12-24"))).toBe('"2016-12-24T00:00:00.000Z"');
});
