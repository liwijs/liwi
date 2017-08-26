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
    var _this = this;

    return this.next().then(function () {
      return _this.result();
    });
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
    for (let keyPromise of this.keysIterator()) {
      yield keyPromise.then(function (key) {
        return key && _this3.result();
      });
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

export { AbstractCursor as default };
//# sourceMappingURL=AbstractCursor.js.map