'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _AbstractCursor = require('../store/AbstractCursor');

var _AbstractCursor2 = _interopRequireDefault(_AbstractCursor);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let MongoCursor = class MongoCursor extends _AbstractCursor2.default {
    /**
     * @param {MongoStore} store
     * @param {Cursor} cursor
     * @param {Object} criteria
    */
    constructor(store, cursor, criteria) {
        super(store);
        this._cursor = cursor;
        this._criteria = criteria;
    }

    /**
     * @param {number} count
     * @returns
    */advance(count) {
        this._cursor.skip(count);
    }

    /**
     * @returns {Promise.<*>}
    */next() {
        return this._cursor.next().then(value => {
            this._result = value;
            this.key = value && value._id;
            return this.key;
        });
    }

    /**
     * @param {number} newLimit
     * @returns {Promise}
    */limit(newLimit) {
        this._cursor.limit(newLimit);
        return Promise.resolve();
    }

    /**
     * @param {boolean} [applyLimit]
    */count() {
        let applyLimit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        return this._cursor.count(applyLimit);
    }

    result() {
        return Promise.resolve(this._result);
    }

    close() {
        if (this._cursor) {
            this._cursor.close();
            this._cursor = this._store = this._result = undefined;
        }

        return Promise.resolve();
    }

    /**
     * @returns {Promise.<Array>}
    */toArray() {
        return this._cursor.toArray();
    }
};
exports.default = MongoCursor;
//# sourceMappingURL=MongoCursor.js.map