var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _t from 'tcomb-forked';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import assert from 'assert';

var AbstractStore = function () {
  /**
   * @param {AbstractConnection} connection
   */
  function AbstractStore(connection) {
    _assert(connection, _t.Any, 'connection');

    _classCallCheck(this, AbstractStore);

    assert(connection);
    this._connection = connection;
  }

  _createClass(AbstractStore, [{
    key: 'findAll',
    value: function findAll(criteria, sort) {
      _assert(criteria, _t.maybe(_t.Object), 'criteria');

      _assert(sort, _t.maybe(_t.Object), 'sort');

      return _assert(function () {
        return this.cursor(criteria, sort).then(function (cursor) {
          return cursor.toArray();
        });
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'connection',
    get: function get() {
      return _assert(function () {
        return this._connection;
      }.apply(this, arguments), _t.Any, 'return value');
    }
  }]);

  return AbstractStore;
}();

export default AbstractStore;

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