import { strictEqual } from 'assert';
import { stringify } from '../../src/extended-json';

suite('stringify', () => {
  test('simple string', () => {
    strictEqual(stringify('test'), '"test"');
  });

  test('Date', () => {
    strictEqual(stringify(new Date('2016-12-24')), '"2016-12-24T00:00:00.000Z"');
  });
});
