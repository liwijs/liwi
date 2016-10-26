import _t from 'tcomb-forked';
import assert from 'assert';

export default class AbstractStore {
  /**
   * @param {AbstractConnection} connection
   */
  constructor(connection) {
    _assert(connection, _t.Any, 'connection');

    assert(connection);
    this._connection = connection;
  }

  get connection() {
    return _assert(function () {
      return this._connection;
    }.apply(this, arguments), _t.Any, 'return value');
  }

  findAll(criteria, sort) {
    _assert(criteria, _t.maybe(_t.Object), 'criteria');

    _assert(sort, _t.maybe(_t.Object), 'sort');

    return _assert(function () {
      return this.cursor(criteria, sort).then(cursor => cursor.toArray());
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
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=AbstractStore.js.map