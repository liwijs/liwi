'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractCursor = require('../store/AbstractCursor');

var _AbstractCursor2 = _interopRequireDefault(_AbstractCursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let MongoCursor = class extends _AbstractCursor2.default {
  constructor(store, cursor) {
    super(store), this._cursor = cursor;
  }

  advance(count) {
    this._cursor.skip(count);
  }

  next() {
    return this._cursor.next().then(value => (this._result = value, this.key = value && value._id, this.key));
  }

  limit(newLimit) {
    return this._cursor.limit(newLimit), Promise.resolve(this);
  }

  count(applyLimit = false) {
    return this._cursor.count(applyLimit);
  }

  result() {
    return Promise.resolve(this._result);
  }

  close() {

    return this._cursor && (this._cursor.close(), this._cursor = void 0, this._store = void 0, this._result = void 0), Promise.resolve();
  }

  toArray() {
    return this._cursor.toArray();
  }
};
exports.default = MongoCursor;
//# sourceMappingURL=MongoCursor.js.map