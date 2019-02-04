import { BaseModel, Update as UpdateType } from 'liwi-types';
import InternalCommonStoreClientInterface from './InternalCommonStoreClient';
import StoreInterface, {
  UpsertResult as AbstractStoreUpsertResult,
} from './Store';
import AbstractConnection from './AbstractConnection';
import AbstractCursor from './AbstractCursor';
import AbstractQuery, {
  SubscribeResult as AbstractQuerySubscribeResult,
  SubscribeCallback as AbstractQuerySubscribeCallback,
} from './AbstractQuery';
import AbstractStore from './AbstractStore';

export type InternalCommonStoreClient<
  Model extends BaseModel,
  KeyPath extends string,
  Cursor extends AbstractCursor<Model, KeyPath, any>
> = InternalCommonStoreClientInterface<Model, KeyPath, Cursor>;

export type Store<
  Model extends BaseModel,
  KeyPath extends string,
  Connection extends AbstractConnection,
  Cursor extends AbstractCursor<Model, KeyPath, any>,
  Query extends AbstractQuery<Model>
> = StoreInterface<Model, KeyPath, Connection, Cursor, Query>;

export type UpsertResult<Model extends BaseModel> = AbstractStoreUpsertResult<
  Model
>;

export type SubscribeResult = AbstractQuerySubscribeResult;
export type SubscribeCallback<
  Model extends BaseModel
> = AbstractQuerySubscribeCallback<Model>;

export type Update<Model extends BaseModel> = UpdateType<Model>;

export { AbstractConnection, AbstractCursor, AbstractQuery, AbstractStore };
