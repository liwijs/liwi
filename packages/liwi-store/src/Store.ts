import { BaseModel, Criteria, InsertType, Sort, Update } from 'liwi-types';
import AbstractConnection from './AbstractConnection';
import AbstractCursor from './AbstractCursor';
import AbstractQuery from './AbstractQuery';

export interface UpsertResult<Model extends BaseModel> {
  object: Model;
  inserted: boolean;
}
export default interface Store<
  Model extends BaseModel,
  KeyPath extends string,
  Connection extends AbstractConnection,
  Cursor extends AbstractCursor<Model, KeyPath, any>,
  Query extends AbstractQuery<Model, any>
> {
  readonly keyPath: KeyPath;

  readonly connection: Connection;

  createQuery(criteria: any): Query;

  findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Array<any>>;

  findByKey(key: any): Promise<Model | undefined>;

  findOne(
    criteria: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<Model | undefined>;

  cursor(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Cursor>;

  insertOne(object: InsertType<Model, KeyPath>): Promise<Model>;

  replaceOne(object: Model): Promise<Model>;

  replaceSeveral(objects: Array<Model>): Promise<Array<Model>>;

  upsertOne(object: InsertType<Model, KeyPath>): Promise<Model>;

  upsertOneWithInfo(
    object: InsertType<Model, KeyPath>,
  ): Promise<UpsertResult<Model>>;

  partialUpdateByKey(key: any, partialUpdate: Update<Model>): Promise<Model>;

  partialUpdateOne(object: Model, partialUpdate: Update<Model>): Promise<Model>;

  partialUpdateMany(
    criteria: Criteria<Model>,
    partialUpdate: Update<Model>,
  ): Promise<void>;

  deleteByKey(key: any): Promise<void>;

  deleteOne(object: Model): Promise<void>;

  deleteMany(selector: Criteria<Model>): Promise<void>;
}
