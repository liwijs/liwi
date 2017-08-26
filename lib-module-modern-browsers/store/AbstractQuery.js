let AbstractQuery = class {

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
}; // eslint-disable-next-line no-unused-vars

export { AbstractQuery as default };
//# sourceMappingURL=AbstractQuery.js.map