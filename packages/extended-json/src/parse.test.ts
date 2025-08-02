import parse from "./parse.ts";

test("simple string", () => {
  expect(parse('"test"')).toBe("test");
});

test("Date", () => {
  const date = parse('"2016-12-24T00:00:00.000Z"');
  expect(date).toBeInstanceOf(Date);
  expect((date as Date).getTime()).toBe(new Date("2016-12-24").getTime());
});
