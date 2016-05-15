'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @function
 * @param fn
*/
function _asyncToGenerator(fn) { return (/**
                                         * @function
                                        */ function () { var gen = fn.apply(this, arguments); return new Promise( /**
                                                                                                                   * @function
                                                                                                                   * @param resolve
                                                                                                                   * @param reject
                                                                                                                  */ function (resolve, reject) { /**
                                                                                                                                                   * @function
                                                                                                                                                   * @param key
                                                                                                                                                   * @param arg
                                                                                                                                                  */ function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then( /**
                                                                                                                                                                                                                                                                                                                                                                 * @function
                                                                                                                                                                                                                                                                                                                                                                 * @param value
                                                                                                                                                                                                                                                                                                                                                                */ function (value) { return step("next", value); }, /**
                                                                                                                                                                                                                                                                                                                                                                                                                      * @function
                                                                                                                                                                                                                                                                                                                                                                                                                      * @param err
                                                                                                                                                                                                                                                                                                                                                                                                                     */ function (err) { return step("throw", err); }); } } return step("next"); }); } ); }

let AbstractCursor = class AbstractCursor {
    /**
     * @param {Store} store
    */

    constructor(store) {
        this._store = store;
    }

    /**
     * @member {Store} store
    */get store() {
        return this._store;
    }

    close() {
        throw new Error('close() missing implementation');
    }

    /**
     * @returns {Promise.<*>}
    */next() {
        throw new Error('next() missing implementation');
    }

    /**
     * @param {number} newLimit
     * @returns {Promise}
    */limit(newLimit) {
        throw new Error('limit() missing implementation');
    }

    /**
     * @param {boolean} [applyLimit]
    */count() {
        let applyLimit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        throw new Error('count() missing implementation');
    }

    /**
     * @returns {Promise.<ObjectType>}
    */result() {
        return this.store.findByKey(this.key);
    }

    /**
     * @returns {Promise}
    */delete() {
        return this.store.deleteByKey(this.key);
    }

    /**
     * @param {Function} callback
     * @returns {Promise}
    */forEachKeys(callback) {
        var _this = this;

        return _asyncToGenerator( /**
                                   * @function
                                  */function* () {
            while (true) {
                const key = yield _this.next();
                if (!key) return;

                yield callback(key);
            }
        })();
    }

    /**
     * @param callback
     * @returns {Promise}
    */forEach(callback) {
        return this.forEachKeys(() => this.result().then(result => callback(result)));
    }

    *keysIterator() {
        while (true) {
            yield this.next();
        }
    }

    *[Symbol.iterator]() {
        for (let keyPromise of this.keysIterator()) {
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
};
exports.default = AbstractCursor;
//# sourceMappingURL=AbstractCursor.js.map