'use strict';

var _assert = require('assert');

var _extendedJson = require('../../../extended-json');

/* global suite, test */
suite('parse', () => {
  test('simple string', () => {
    (0, _assert.strictEqual)((0, _extendedJson.parse)('"test"'), 'test');
  });

  test('Date', () => {
    (0, _assert.strictEqual)((0, _extendedJson.parse)('"2016-12-24T00:00:00.000Z"').getTime(), new Date('2016-12-24').getTime());
  });
});
//# sourceMappingURL=parse.js.map