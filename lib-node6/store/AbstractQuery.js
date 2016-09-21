'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AbstractStore = require('./AbstractStore');

var _AbstractStore2 = _interopRequireDefault(_AbstractStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AbstractQuery {

  constructor(store, queryCallback) {
    this.store = store;
    this.queryCallback = queryCallback;
  }

}
exports.default = AbstractQuery; // eslint-disable-next-line no-unused-vars
//# sourceMappingURL=AbstractQuery.js.map