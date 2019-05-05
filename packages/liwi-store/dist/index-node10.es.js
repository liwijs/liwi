import assert from 'assert';

class AbstractConnection {}

/* eslint-disable no-await-in-loop */
class AbstractCursor {
  nextResult() {
    return this.next().then(() => this.result());
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

/* eslint-disable no-await-in-loop */
class AbstractStoreCursor extends AbstractCursor {
  constructor(store) {
    super();
    this._store = store;
  }

  get store() {
    return this._store;
  }

  overrideStore(store) {
    this._store = store;
  }

  result() {
    if (!this.key) throw new Error('Cannot call result() before next()');
    return this.store.findByKey(this.key);
  }

  delete() {
    return this.store.deleteByKey(this.key);
  }

}

class AbstractQuery {
  fetchAndSubscribe(callback) {
    return this._subscribe(callback, true);
  }

  subscribe(callback) {
    return this._subscribe(callback, false);
  }

}

class AbstractStore {
  constructor(connection, keyPath) {
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

  async upsertOne(object) {
    const result = await this.upsertOneWithInfo(object);
    return result.object;
  }

  deleteOne(object) {
    return this.deleteByKey(object[this.keyPath]);
  }

}

export { AbstractConnection, AbstractCursor, AbstractQuery, AbstractStore, AbstractStoreCursor };
//# sourceMappingURL=index-node10.es.js.map
