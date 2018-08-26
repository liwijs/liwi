import parse from './parse';

test('simple string', () => {
  expect(parse('"test"')).toBe('test');
});

test('Date', () => {
  expect(parse('"2016-12-24T00:00:00.000Z"').getTime()).toBe(
    new Date('2016-12-24').getTime(),
  );
});
