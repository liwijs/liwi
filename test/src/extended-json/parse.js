/* global suite, test */
import { strictEqual } from 'assert';
import { parse } from '../../../src/extended-json';

suite('parse', () => {
  test('simple string', () => {
    strictEqual(parse('"test"'), 'test');
  });

  test('Date', () => {
    strictEqual(parse('"2016-12-24T00:00:00.000Z"').getTime(), new Date('2016-12-24').getTime());
  });
});
