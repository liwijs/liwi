import type {
  BaseModel,
  Criteria,
  InsertType,
  QueryOptions,
  Sort,
  Transformer,
  Update,
  AllowedKeyValue,
  SetOptional,
  OptionalBaseModelKeysForInsert,
} from 'liwi-types';
import type AbstractConnection from './AbstractConnection';
import type AbstractStoreCursor from './AbstractStoreCursor';
import type { InternalCommonStoreClient } from './InternalCommonStoreClient';
import type { Query, QueryParams } from './Query';

export type UpsertPartialObject<
  KeyPath extends keyof Model,
  KeyValue extends AllowedKeyValue,
  Model extends BaseModel & Record<KeyPath, KeyValue>,
  K extends Exclude<keyof Model, KeyPath | OptionalBaseModelKeysForInsert>,
> = SetOptional<Model, K | KeyPath | OptionalBaseModelKeysForInsert>;

export interface UpsertResult<Model extends BaseModel> {
  object: Model;
  inserted: boolean;
}
export interface Store<
  KeyPath extends keyof Model,
  KeyValue extends AllowedKeyValue,
  Model extends BaseModel & Record<KeyPath, KeyValue>,
  ModelInsertType extends InsertType<Model, KeyPath>,
  Connection extends AbstractConnection,
> extends InternalCommonStoreClient<Model> {
  readonly connection: Connection;

  readonly keyPath: KeyPath;

  createQuerySingleItem: <
    Result extends Record<KeyPath, KeyValue>,
    Params extends QueryParams<Params>,
  >(
    options: QueryOptions<Model>,
    transformer?: Transformer<Model, Result>,
  ) => Query<Result, Params, KeyValue>;

  createQueryCollection: <
    Item extends Record<KeyPath, KeyValue>,
    Params extends QueryParams<Params>,
  >(
    options: QueryOptions<Model>,
    transformer?: Transformer<Model, Item>,
  ) => Query<Item[], Params, KeyValue>;

  findAll: (criteria?: Criteria<Model>, sort?: Sort<Model>) => Promise<Model[]>;

  findByKey: (
    key: KeyValue,
    criteria?: Criteria<Model>,
  ) => Promise<Model | undefined>;

  findOne: (
    criteria: Criteria<Model>,
    sort?: Sort<Model>,
  ) => Promise<Model | undefined>;

  cursor: <Result = Model>(
    criteria?: Criteria<Model>,
    sort?: Sort<Model>,
  ) => Promise<AbstractStoreCursor<any, KeyValue, Model, Result>>;

  insertOne: (object: ModelInsertType) => Promise<Model>;

  replaceOne: (object: Model) => Promise<Model>;

  replaceSeveral: (objects: Model[]) => Promise<Model[]>;

  upsertOne: <
    K extends Exclude<keyof Model, KeyPath | OptionalBaseModelKeysForInsert>,
  >(
    object: UpsertPartialObject<KeyPath, KeyValue, Model, K>,
    setOnInsertPartialObject?: Pick<Model, K>,
  ) => Promise<Model>;

  upsertOneWithInfo: <
    K extends Exclude<keyof Model, KeyPath | OptionalBaseModelKeysForInsert>,
  >(
    object: UpsertPartialObject<KeyPath, KeyValue, Model, K>,
    setOnInsertPartialObject?: Pick<Model, K>,
  ) => Promise<UpsertResult<Model>>;

  partialUpdateByKey: (
    key: KeyValue,
    partialUpdate: Update<Model>,
    criteria?: Criteria<Model>,
  ) => Promise<Model>;

  partialUpdateOne: (
    object: Model,
    partialUpdate: Update<Model>,
  ) => Promise<Model>;

  partialUpdateMany: (
    criteria: Criteria<Model>,
    partialUpdate: Update<Model>,
  ) => Promise<void>;

  deleteByKey: (key: KeyValue, criteria?: Criteria<Model>) => Promise<void>;

  deleteOne: (object: Model) => Promise<void>;

  deleteMany: (selector: Criteria<Model>) => Promise<void>;
}
