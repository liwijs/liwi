"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class RestCursor {
    constructor(cursor) {
        this._cursor = cursor;
    }

    toArray() {
        return this._cursor.toArray();
    }
}
exports.default = RestCursor;
//# sourceMappingURL=RestCursor.js.map