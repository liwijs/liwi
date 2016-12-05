'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class AbstractQuery {

  constructor(store, queryCallback) {
    this.store = store;
    this.queryCallback = queryCallback;
  }

  fetchAndSubscribe(callback, ...args) {
    return this._subscribe(callback, true, args);
  }

  subscribe(callback, ...args) {
    return this._subscribe(callback, false, args);
  }
}
exports.default = AbstractQuery; // eslint-disable-next-line no-unused-vars
//# sourceMappingURL=AbstractQuery.js.map