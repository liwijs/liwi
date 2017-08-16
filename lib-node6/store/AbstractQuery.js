'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
let AbstractQuery = class {

  constructor(store, queryCallback) {
    this.store = store, this.queryCallback = queryCallback;
  }

  fetchAndSubscribe(callback, ...args) {
    return this._subscribe(callback, true, args);
  }

  subscribe(callback, ...args) {
    return this._subscribe(callback, false, args);
  }
}; // eslint-disable-next-line no-unused-vars

exports.default = AbstractQuery;
//# sourceMappingURL=AbstractQuery.js.map