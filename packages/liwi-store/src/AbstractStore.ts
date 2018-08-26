import assert from 'assert';
import { BaseModel, InsertType, Update, Criteria, Sort } from 'liwi-types';
import AbstractConnection from './AbstractConnection';
import AbstractCursor from './AbstractCursor';

export default abstract class AbstractStore<
  Model extends BaseModel,
  KeyPath extends string,
  Connection extends AbstractConnection,
  Cursor extends AbstractCursor<Model, KeyPath, any>
> {
  _connection: Connection;

  readonly keyPath: KeyPath;

  constructor(connection: Connection, keyPath: KeyPath) {
    assert(connection);
    this._connection = connection;
    this.keyPath = keyPath;
  }

  get connection(): Connection {
    return this._connection;
  }

  findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Array<any>> {
    return this.cursor(criteria, sort).then((cursor: Cursor) =>
      cursor.toArray(),
    );
  }

  abstract insertOne(object: InsertType<Model, KeyPath>): Promise<Model>;

  abstract replaceOne(object: Model): Promise<Model>;

  abstract upsertOne(
    object: InsertType<Model, KeyPath>,
  ): Promise<Model | Model>;

  abstract partialUpdateByKey(
    key: any,
    partialUpdate: Update<Model>,
  ): Promise<Model>;

  abstract partialUpdateOne(
    object: Model,
    partialUpdate: Update<Model>,
  ): Promise<Model>;

  abstract partialUpdateMany(
    criteria: Criteria<Model>,
    partialUpdate: Update<Model>,
  ): Promise<void>;

  abstract deleteByKey(key: any): Promise<void>;

  abstract cursor(
    criteria?: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<Cursor>;

  abstract findByKey(key: any): Promise<Model | undefined>;

  abstract findOne(
    criteria: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<Model | undefined>;
}
