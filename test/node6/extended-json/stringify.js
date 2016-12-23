'use strict';

var _assert = require('assert');

var _extendedJson = require('../../../extended-json');

/* global suite, test */
suite('stringify', () => {
  test('simple string', () => {
    (0, _assert.strictEqual)((0, _extendedJson.stringify)('test'), '"test"');
  });

  test('Date', () => {
    (0, _assert.strictEqual)((0, _extendedJson.stringify)(new Date('2016-12-24')), '"2016-12-24T00:00:00.000Z"');
  });
});
//# sourceMappingURL=stringify.js.map