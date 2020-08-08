class AbstractConnection {}

/* eslint-disable no-await-in-loop */
class AbstractCursor {
  nextResult() {
    var _this = this;

    return this.next().then(function () {
      return _this.result();
    });
  }

  async forEachKeys(callback) {
    while (true) {
      const key = await this.next();
      if (!key) return;
      await callback(key);
    }
  }

  forEach(callback) {
    var _this2 = this;

    return this.forEachKeys(function () {
      return _this2.result().then(function (result) {
        return callback(result);
      });
    });
  }

  *keysIterator() {
    while (true) {
      yield this.next();
    }
  }

  *[Symbol.iterator]() {
    var _this3 = this;

    // eslint-disable-next-line no-restricted-syntax
    for (const keyPromise of this.keysIterator()) {
      yield keyPromise.then(function (key) {
        return key && _this3.result();
      });
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

export { AbstractConnection, AbstractCursor, AbstractStoreCursor };
//# sourceMappingURL=index-browsermodern.es.js.map
