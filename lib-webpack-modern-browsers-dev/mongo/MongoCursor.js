import _t from 'tcomb-forked';
import Cursor from 'mongodb/lib/cursor';
import MongoStore from './MongoStore';
import AbstractCursor from '../store/AbstractCursor';

export default class MongoCursor extends AbstractCursor {
  constructor(store, cursor) {
    _assert(store, MongoStore, 'store');

    _assert(cursor, Cursor, 'cursor');

    super(store);
    this._cursor = cursor;
  }

  advance(count) {
    _assert(count, _t.Number, 'count');

    return _assert(function () {
      this._cursor.skip(count);
    }.apply(this, arguments), _t.Nil, 'return value');
  }

  next() {
    return _assert(function () {
      return this._cursor.next().then(value => {
        this._result = value;
        this.key = value && value._id;
        return this.key;
      });
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  limit(newLimit) {
    _assert(newLimit, _t.Number, 'newLimit');

    return _assert(function () {
      this._cursor.limit(newLimit);
      return Promise.resolve(this);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  count() {
    var applyLimit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    _assert(applyLimit, _t.Boolean, 'applyLimit');

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
    }.apply(this, arguments), _t.Promise, 'return value');
  }
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }

    return type(x);
  }

  if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=MongoCursor.js.map