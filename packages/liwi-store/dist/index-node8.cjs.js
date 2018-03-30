'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var assert = _interopDefault(require('assert'));

let AbstractConnection = class {};

let AbstractCursor = class {

  constructor(store) {
    this._store = store;
  }

  get store() {
    return this._store;
  }

  close() {
    throw new Error('close() missing implementation');
  }

  next() {
    throw new Error('next() missing implementation');
  }

  nextResult() {
    return this.next().then(() => this.result());
  }

  limit() {
    throw new Error('limit() missing implementation');
  }

  count(applyLimit = false) {
    throw new Error('count() missing implementation');
  }

  result() {
    return this.store.findByKey(this.key);
  }

  delete() {
    return this.store.deleteByKey(this.key);
  }

  async forEachKeys(callback) {
    while (true) {
      const key = await this.next();
      if (!key) return;

      await callback(key);
    }
  }

  forEach(callback) {
    return this.forEachKeys(() => this.result().then(result => callback(result)));
  }

  *keysIterator() {
    while (true) {
      yield this.next();
    }
  }

  *[Symbol.iterator]() {
    // eslint-disable-next-line no-restricted-syntax
    for (const keyPromise of this.keysIterator()) {
      yield keyPromise.then(key => key && this.result());
    }
  }

  // TODO Symbol.asyncIterator, https://phabricator.babeljs.io/T7356
  /*
    async *keysAsyncIterator() {
        while (true) {
             const key = await this.next();
             if (!key) return;
              yield key;
        }
     }
      async *[Symbol.asyncIterator] {
        for await (let key of this.keysAsyncIterator()) {
            yield await this.result();
        }
     }
     */
}; /* eslint-disable no-await-in-loop */

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

let AbstractStore = class {
  /**
   * @param {AbstractConnection} connection
   */
  constructor(connection) {
    assert(connection);
    this._connection = connection;
  }

  get connection() {
    return this._connection;
  }

  findAll(criteria, sort) {
    return this.cursor(criteria, sort).then(cursor => cursor.toArray());
  }
};

exports.AbstractConnection = AbstractConnection;
exports.AbstractCursor = AbstractCursor;
exports.AbstractQuery = AbstractQuery;
exports.AbstractStore = AbstractStore;
//# sourceMappingURL=index-node8.cjs.js.map
