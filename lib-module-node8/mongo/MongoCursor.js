
import AbstractCursor from '../store/AbstractCursor';
let MongoCursor = class extends AbstractCursor {
  constructor(store, cursor) {
    super(store), this._cursor = cursor;
  }

  advance(count) {
    this._cursor.skip(count);
  }

  next() {
    return this._cursor.next().then(value => (this._result = value, this.key = value && value._id, this.key));
  }

  limit(newLimit) {
    return this._cursor.limit(newLimit), Promise.resolve(this);
  }

  count(applyLimit = false) {
    return this._cursor.count(applyLimit);
  }

  result() {
    return Promise.resolve(this._result);
  }

  close() {

    return this._cursor && (this._cursor.close(), this._cursor = void 0, this._store = void 0, this._result = void 0), Promise.resolve();
  }

  toArray() {
    return this._cursor.toArray();
  }
};
export { MongoCursor as default };
//# sourceMappingURL=MongoCursor.js.map