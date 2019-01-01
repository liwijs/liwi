import assert from 'assert';
import { BaseModel, InsertType, Update, Criteria, Sort } from 'liwi-types';
import Store, { UpsertResult } from './Store';
import AbstractConnection from './AbstractConnection';
import AbstractCursor from './AbstractCursor';
import AbstractQuery from './AbstractQuery';

export default abstract class AbstractStore<
  Model extends BaseModel,
  KeyPath extends string,
  Connection extends AbstractConnection,
  Cursor extends AbstractCursor<Model, KeyPath, any>,
  Query extends AbstractQuery<Model, any>
> implements Store<Model, KeyPath, Connection, Cursor, Query> {
  private readonly _connection: Connection;

  readonly keyPath: KeyPath;

  constructor(connection: Connection, keyPath: KeyPath) {
    assert(connection);
    this._connection = connection;
    this.keyPath = keyPath;
  }

  get connection(): Connection {
    return this._connection;
  }

  abstract createQuery(criteria: any): Query;

  findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Array<any>> {
    return this.cursor(criteria, sort).then((cursor: Cursor) =>
      cursor.toArray(),
    );
  }

  abstract findByKey(key: any): Promise<Model | undefined>;

  abstract findOne(
    criteria: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<Model | undefined>;

  abstract cursor(
    criteria?: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<Cursor>;

  abstract insertOne(object: InsertType<Model, KeyPath>): Promise<Model>;

  abstract replaceOne(object: Model): Promise<Model>;

  abstract replaceSeveral(objects: Array<Model>): Promise<Array<Model>>;

  async upsertOne(object: InsertType<Model, KeyPath>): Promise<Model> {
    const result = await this.upsertOneWithInfo(object);
    return result.object;
  }

  abstract upsertOneWithInfo(
    object: InsertType<Model, KeyPath>,
  ): Promise<UpsertResult<Model>>;

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

  deleteOne(object: Model): Promise<void> {
    return this.deleteByKey(object[this.keyPath]);
  }

  abstract deleteMany(selector: Criteria<Model>): Promise<void>;
}
