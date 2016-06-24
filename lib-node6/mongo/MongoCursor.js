'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _MongoStore = require('./MongoStore');

var _MongoStore2 = _interopRequireDefault(_MongoStore);

var _cursor = require('mongodb/lib/cursor');

var _cursor2 = _interopRequireDefault(_cursor);

var _AbstractCursor = require('../store/AbstractCursor');

var _AbstractCursor2 = _interopRequireDefault(_AbstractCursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MongoCursor extends _AbstractCursor2.default {
    constructor(store, cursor) {
        super(store);
        this._cursor = cursor;
    }

    advance(count) {
        this._cursor.skip(count);
    }

    next() {
        return this._cursor.next().then(value => {
            this._result = value;
            this.key = value && value._id;
            return this.key;
        });
    }

    limit(newLimit) {
        this._cursor.limit(newLimit);
        return Promise.resolve(this);
    }

    count() {
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

    toArray() {
        return this._cursor.toArray();
    }
}
exports.default = MongoCursor;
//# sourceMappingURL=MongoCursor.js.map