import { AbstractStoreCursor } from 'liwi-store';
import { AllowedKeyValue } from 'liwi-types';
import { Cursor } from 'mongodb';
import { MongoBaseModel, MongoInsertType } from './MongoBaseModel';
import MongoStore from './MongoStore';

export default class MongoCursor<
  Model extends MongoBaseModel<KeyValue>,
  Result extends Partial<Model> = Model,
  KeyValue extends AllowedKeyValue = Model['_id'],
  ModelInsertType extends MongoInsertType<Model> = MongoInsertType<Model>
> extends AbstractStoreCursor<
  MongoStore<Model, KeyValue>,
  KeyValue,
  Model,
  Result
> {
  // key in AbstractCursor

  private readonly cursor: Cursor;

  private _result?: Result;

  constructor(
    store: MongoStore<Model, KeyValue, ModelInsertType>,
    cursor: Cursor,
  ) {
    super(store);
    this.cursor = cursor;
  }

  advance(count: number): void {
    this.cursor.skip(count);
  }

  next(): Promise<any> {
    return this.cursor.next().then((value) => {
      this._result = value;
      this.key = value?._id;
      return this.key;
    });
  }

  limit(newLimit: number): Promise<this> {
    this.cursor.limit(newLimit);
    return Promise.resolve(this);
  }

  count(applySkipLimit = false): Promise<number> {
    return this.cursor.count(applySkipLimit);
  }

  result(): Promise<Result> {
    if (!this._result) throw new Error('Cannot call result() before next()');
    return Promise.resolve(this._result as Result);
  }

  close(): Promise<void> {
    if (this.cursor) {
      this.cursor.close();
    }

    return Promise.resolve();
  }

  toArray(): Promise<Result[]> {
    return this.cursor.toArray();
  }
}
