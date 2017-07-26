function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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

  forEachKeys(callback) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      while (true) {
        const key = yield _this2.next();
        if (!key) return;

        yield callback(key);
      }
    })();
  }

  forEach(callback) {
    var _this3 = this;

    return this.forEachKeys(function () {
      return _this3.result().then(function (result) {
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
    var _this4 = this;

    // eslint-disable-next-line no-restricted-syntax
    for (let keyPromise of this.keysIterator()) {
      yield keyPromise.then(function (key) {
        return key && _this4.result();
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