function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

export default class AbstractCursor {

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

    limit(newLimit) {
        throw new Error('limit() missing implementation');
    }

    count() {
        var applyLimit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        throw new Error('count() missing implementation');
    }

    result() {
        return this.store.findByKey(this.key);
    }

    delete() {
        return this.store.deleteByKey(this.key);
    }

    forEachKeys(callback) {
        var _this = this;

        return _asyncToGenerator(function* () {
            while (true) {
                var key = yield _this.next();
                if (!key) return;

                yield callback(key);
            }
        })();
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
        for (var keyPromise of this.keysIterator()) {
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
}
//# sourceMappingURL=AbstractCursor.js.map