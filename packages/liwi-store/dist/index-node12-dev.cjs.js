'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class AbstractConnection {}

class AbstractCursor {
  nextResult() {
    return this.next().then(() => this.result());
  }

  async forEachKeys(callback) {
    while (true) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
    for (const keyPromise of this.keysIterator()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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

exports.AbstractConnection = AbstractConnection;
exports.AbstractCursor = AbstractCursor;
exports.AbstractStoreCursor = AbstractStoreCursor;
//# sourceMappingURL=index-node12-dev.cjs.js.map
