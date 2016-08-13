export default class RestCursor {
    constructor(cursor) {
        this._cursor = cursor;
    }

    toArray() {
        return this._cursor.toArray();
    }
}
