import {
  BaseModel,
  Criteria,
  InsertType,
  QueryOptions,
  Sort,
  Transformer,
  Update,
  AllowedKeyValue,
} from 'liwi-types';
import AbstractConnection from './AbstractConnection';
import AbstractStoreCursor from './AbstractStoreCursor';
import { InternalCommonStoreClient } from './InternalCommonStoreClient';
import { Query, QueryParams } from './Query';

export interface UpsertResult<Model extends BaseModel> {
  object: Model;
  inserted: boolean;
}
export interface Store<
  KeyPath extends string,
  KeyValue extends AllowedKeyValue,
  Model extends BaseModel & Record<KeyPath, KeyValue>,
  ModelInsertType extends InsertType<Model, KeyPath>,
  Connection extends AbstractConnection
> extends InternalCommonStoreClient<Model> {
  readonly connection: Connection;

  readonly keyPath: KeyPath;

  createQuerySingleItem<
    Result extends Record<KeyPath, KeyValue>,
    Params extends QueryParams<Params>
  >(
    options: QueryOptions<Model>,
    transformer?: Transformer<Model, Result>,
  ): Query<Result, Params, KeyValue>;

  createQueryCollection<
    Item extends Record<KeyPath, KeyValue>,
    Params extends QueryParams<Params>
  >(
    options: QueryOptions<Model>,
    transformer?: Transformer<Model, Item>,
  ): Query<Item[], Params, KeyValue>;

  findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Model[]>;

  findByKey(
    key: KeyValue,
    criteria?: Criteria<Model>,
  ): Promise<Model | undefined>;

  findOne(
    criteria: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<Model | undefined>;

  cursor<Result = Model>(
    criteria?: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<AbstractStoreCursor<any, KeyValue, Model, Result>>;

  insertOne(object: ModelInsertType): Promise<Model>;

  replaceOne(object: Model): Promise<Model>;

  replaceSeveral(objects: Model[]): Promise<Model[]>;

  upsertOne(object: ModelInsertType): Promise<Model>;

  upsertOneWithInfo(object: ModelInsertType): Promise<UpsertResult<Model>>;

  partialUpdateByKey(
    key: KeyValue,
    partialUpdate: Update<Model>,
    criteria?: Criteria<Model>,
  ): Promise<Model>;

  partialUpdateOne(object: Model, partialUpdate: Update<Model>): Promise<Model>;

  partialUpdateMany(
    criteria: Criteria<Model>,
    partialUpdate: Update<Model>,
  ): Promise<void>;

  deleteByKey(key: KeyValue, criteria?: Criteria<Model>): Promise<void>;

  deleteOne(object: Model): Promise<void>;

  deleteMany(selector: Criteria<Model>): Promise<void>;
}
