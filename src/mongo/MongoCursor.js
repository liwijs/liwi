import Cursor from 'mongodb/lib/cursor';
import MongoStore from './MongoStore';
import AbstractCursor from '../store/AbstractCursor';
import type { ResultType } from '../types';

export default class MongoCursor extends AbstractCursor<MongoStore> {
  constructor(store: MongoStore, cursor: Cursor) {
    super(store);
    this._cursor = cursor;
  }

  advance(count: number): void {
    this._cursor.skip(count);
  }

  next(): Promise<any> {
    return this._cursor.next().then(value => {
      this._result = value;
      this.key = value && value._id;
      return this.key;
    });
  }

  limit(newLimit: number): Promise {
    this._cursor.limit(newLimit);
    return Promise.resolve(this);
  }

  count(applyLimit: boolean = false) {
    return this._cursor.count(applyLimit);
  }

  result() {
    return Promise.resolve(this._result);
  }

  close() {
    if (this._cursor) {
      this._cursor.close();
      this._cursor = undefined;
      this._store = undefined;
      this._result = undefined;
    }

    return Promise.resolve();
  }

  toArray(): Promise<Array<ResultType>> {
    return this._cursor.toArray();
  }
}
