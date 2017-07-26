'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _cursor = require('mongodb/lib/cursor');

var _cursor2 = _interopRequireDefault(_cursor);

var _MongoStore = require('./MongoStore');

var _MongoStore2 = _interopRequireDefault(_MongoStore);

var _AbstractCursor = require('../store/AbstractCursor');

var _AbstractCursor2 = _interopRequireDefault(_AbstractCursor);

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ResultType = _flowRuntime2.default.tdz(() => _types.ResultType);

let MongoCursor = class extends _AbstractCursor2.default {
  constructor(store, cursor) {
    let _storeType = _flowRuntime2.default.ref(_MongoStore2.default);

    let _cursorType = _flowRuntime2.default.ref(_cursor2.default);

    _flowRuntime2.default.param('store', _storeType).assert(store);

    _flowRuntime2.default.param('cursor', _cursorType).assert(cursor);

    super(store);

    _flowRuntime2.default.bindTypeParameters(this, _flowRuntime2.default.ref(_MongoStore2.default));

    this._cursor = cursor;
  }

  advance(count) {
    let _countType = _flowRuntime2.default.number();

    _flowRuntime2.default.return(_flowRuntime2.default.void());

    _flowRuntime2.default.param('count', _countType).assert(count);

    this._cursor.skip(count);
  }

  next() {
    const _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.any());

    return this._cursor.next().then(value => {
      this._result = value;
      this.key = value && value._id;
      return this.key;
    }).then(_arg => _returnType2.assert(_arg));
  }

  limit(newLimit) {
    let _newLimitType = _flowRuntime2.default.number();

    const _returnType3 = _flowRuntime2.default.return(_flowRuntime2.default.ref('Promise'));

    _flowRuntime2.default.param('newLimit', _newLimitType).assert(newLimit);

    this._cursor.limit(newLimit);
    return _returnType3.assert(Promise.resolve(this));
  }

  count(applyLimit = false) {
    let _applyLimitType = _flowRuntime2.default.boolean();

    _flowRuntime2.default.param('applyLimit', _applyLimitType).assert(applyLimit);

    return this._cursor.count(applyLimit);
  }

  result() {
    return Promise.resolve(this._result);
  }

  close() {
    if (this._cursor) {
      this._cursor.close();
      this._cursor = undefined;
      this._store = undefined;
      this._result = undefined;
    }

    return Promise.resolve();
  }

  toArray() {
    const _returnType4 = _flowRuntime2.default.return(_flowRuntime2.default.array(_flowRuntime2.default.ref(ResultType)));

    return this._cursor.toArray().then(_arg2 => _returnType4.assert(_arg2));
  }
};
exports.default = MongoCursor;
//# sourceMappingURL=MongoCursor.js.map