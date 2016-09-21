'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _assert2 = require('assert');

var _assert3 = _interopRequireDefault(_assert2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AbstractStore {
  /**
   * @param {AbstractConnection} connection
   */
  constructor(connection) {
    _assert(connection, _tcombForked2.default.Any, 'connection');

    (0, _assert3.default)(connection);
    this._connection = connection;
  }

  get connection() {
    return _assert(function () {
      return this._connection;
    }.apply(this, arguments), _tcombForked2.default.Any, 'return value');
  }

  findAll(criteria, sort) {
    _assert(criteria, _tcombForked2.default.maybe(_tcombForked2.default.Object), 'criteria');

    _assert(sort, _tcombForked2.default.maybe(_tcombForked2.default.Object), 'sort');

    return _assert(function () {
      return this.cursor(criteria, sort).then(cursor => cursor.toArray());
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }
}
exports.default = AbstractStore;

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }

    return type(x);
  }

  if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=AbstractStore.js.map