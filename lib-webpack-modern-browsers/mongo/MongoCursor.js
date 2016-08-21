import Cursor from 'mongodb/lib/cursor';
import MongoStore from './MongoStore';
import AbstractCursor from '../store/AbstractCursor';

export default class MongoCursor extends AbstractCursor {
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
    var applyLimit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

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
//# sourceMappingURL=MongoCursor.js.map