

export default class AbstractQuery {

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
} // eslint-disable-next-line no-unused-vars
//# sourceMappingURL=AbstractQuery.js.map