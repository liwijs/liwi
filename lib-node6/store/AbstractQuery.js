'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class AbstractQuery {

  constructor(store, queryCallback) {
    this.store = store;
    this.queryCallback = queryCallback;
  }

  fetchAndSubscribe(callback) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return this._subscribe(callback, true, args);
  }

  subscribe(callback) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return this._subscribe(callback, false, args);
  }
}
exports.default = AbstractQuery; // eslint-disable-next-line no-unused-vars
//# sourceMappingURL=AbstractQuery.js.map