'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _cursor = require('mongodb/lib/cursor');

var _cursor2 = _interopRequireDefault(_cursor);

var _MongoStore = require('./MongoStore');

var _MongoStore2 = _interopRequireDefault(_MongoStore);

var _AbstractCursor = require('../store/AbstractCursor');

var _AbstractCursor2 = _interopRequireDefault(_AbstractCursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MongoCursor extends _AbstractCursor2.default {
  constructor(store, cursor) {
    _assert(store, _MongoStore2.default, 'store');

    _assert(cursor, _cursor2.default, 'cursor');

    super(store);
    this._cursor = cursor;
  }

  advance(count) {
    _assert(count, _tcombForked2.default.Number, 'count');

    return _assert(function () {
      this._cursor.skip(count);
    }.apply(this, arguments), _tcombForked2.default.Nil, 'return value');
  }

  next() {
    return _assert(function () {
      return this._cursor.next().then(value => {
        this._result = value;
        this.key = value && value._id;
        return this.key;
      });
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  limit(newLimit) {
    _assert(newLimit, _tcombForked2.default.Number, 'newLimit');

    return _assert(function () {
      this._cursor.limit(newLimit);
      return Promise.resolve(this);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  count(applyLimit = false) {
    _assert(applyLimit, _tcombForked2.default.Boolean, 'applyLimit');

    return this._cursor.count(applyLimit);
  }

  result() {
    return Promise.resolve(this._result);
  }

  close() {
    if (this._cursor) {
      this._cursor.close();
      this._cursor = this._store = this._result = undefined;
    }

    return Promise.resolve();
  }

  toArray() {
    return _assert(function () {
      return this._cursor.toArray();
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }
}
exports.default = MongoCursor;

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=MongoCursor.js.map