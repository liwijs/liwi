import assert from 'assert';

class AbstractConnection {}

var _Symbol$iterator = Symbol.iterator;

/* eslint-disable no-await-in-loop */
class AbstractCursor {
  constructor(store) {
    this.key = void 0;
    this._store = void 0;
    this._store = store;
  }

  get store() {
    return this._store;
  }

  nextResult() {
    return this.next().then(() => this.result());
  }

  result() {
    if (!this.key) throw new Error('Cannot call result() before next()');
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

  *[_Symbol$iterator]() {
    // eslint-disable-next-line no-restricted-syntax
    for (const keyPromise of this.keysIterator()) {
      yield keyPromise.then(key => key && this.result());
    }
  } // TODO Symbol.asyncIterator, https://phabricator.babeljs.io/T7356

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


}

class AbstractQuery {
  constructor(store) {
    this.store = void 0;
    this.store = store;
  }

  fetchAndSubscribe(callback, ...args) {
    return this._subscribe(callback, true, args);
  }

  subscribe(callback, ...args) {
    return this._subscribe(callback, false, args);
  }

}

class AbstractStore {
  constructor(connection, keyPath) {
    this._connection = void 0;
    this.keyPath = void 0;
    assert(connection);
    this._connection = connection;
    this.keyPath = keyPath;
  }

  get connection() {
    return this._connection;
  }

  findAll(criteria, sort) {
    return this.cursor(criteria, sort).then(cursor => cursor.toArray());
  }

}

export { AbstractConnection, AbstractCursor, AbstractQuery, AbstractStore };
//# sourceMappingURL=index-node8.es.js.map
