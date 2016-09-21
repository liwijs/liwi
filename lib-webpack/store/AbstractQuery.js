function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// eslint-disable-next-line no-unused-vars
import AbstractStore from './AbstractStore';

var AbstractQuery = function AbstractQuery(store, queryCallback) {
  _classCallCheck(this, AbstractQuery);

  this.store = store;
  this.queryCallback = queryCallback;
};

export default AbstractQuery;
//# sourceMappingURL=AbstractQuery.js.map