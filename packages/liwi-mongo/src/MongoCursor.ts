import { Cursor } from 'mongodb';
import { AbstractCursor } from 'liwi-store';
import MongoStore, { MongoModel, MongoKeyPath } from './MongoStore';

export default class MongoCursor<
  Model extends MongoModel
> extends AbstractCursor<Model, MongoKeyPath, MongoStore<Model>> {
  // key in AbstractCursor

  private cursor: Cursor;

  private _result?: Model;

  constructor(store: MongoStore<Model>, cursor: Cursor) {
    super(store);
    this.cursor = cursor;
  }

  advance(count: number): void {
    this.cursor.skip(count);
  }

  next(): Promise<any> {
    return this.cursor.next().then((value) => {
      this._result = value;
      this.key = value && value._id;
      return this.key;
    });
  }

  limit(newLimit: number): Promise<this> {
    this.cursor.limit(newLimit);
    return Promise.resolve(this);
  }

  count(applyLimit: boolean = false) {
    return this.cursor.count(applyLimit);
  }

  result(): Promise<Model> {
    if (!this._result) throw new Error('Cannot call result() before next()');
    return Promise.resolve(this._result as Model);
  }

  close() {
    if (this.cursor) {
      this.cursor.close();
    }

    return Promise.resolve();
  }

  toArray(): Promise<Array<Model>> {
    return this.cursor.toArray();
  }
}
