'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AbstractStore {
  /**
   * @param {AbstractConnection} connection
   */
  constructor(connection) {
    (0, _assert2.default)(connection);
    this._connection = connection;
  }

  get connection() {
    return this._connection;
  }

  findAll(criteria, sort) {
    return this.cursor(criteria, sort).then(cursor => cursor.toArray());
  }
}
exports.default = AbstractStore;
//# sourceMappingURL=AbstractStore.js.map