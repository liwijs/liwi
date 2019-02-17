import { BaseModel, Update as UpdateType } from 'liwi-types';
import InternalCommonStoreClientInterface from './InternalCommonStoreClient';
import StoreInterface, { UpsertResult as AbstractStoreUpsertResult } from './Store';
import AbstractConnection from './AbstractConnection';
import AbstractCursor from './AbstractCursor';
import AbstractStoreCursor from './AbstractStoreCursor';
import AbstractQuery, { SubscribeResult as AbstractQuerySubscribeResult, SubscribeCallback as AbstractQuerySubscribeCallback } from './AbstractQuery';
import AbstractStore from './AbstractStore';
export declare type InternalCommonStoreClient<Model extends BaseModel, KeyPath extends string, Cursor extends AbstractCursor<Model, KeyPath>> = InternalCommonStoreClientInterface<Model, KeyPath, Cursor>;
export declare type Store<Model extends BaseModel, KeyPath extends string, Connection extends AbstractConnection, Cursor extends AbstractStoreCursor<Model, KeyPath, any>> = StoreInterface<Model, KeyPath, Connection, Cursor>;
export declare type UpsertResult<Model extends BaseModel> = AbstractStoreUpsertResult<Model>;
export declare type SubscribeResult<Value> = AbstractQuerySubscribeResult<Value>;
export declare type SubscribeCallback<Value> = AbstractQuerySubscribeCallback<Value>;
export declare type Update<Model extends BaseModel> = UpdateType<Model>;
export { AbstractConnection, AbstractCursor, AbstractStoreCursor, AbstractQuery, AbstractStore, };
//# sourceMappingURL=index.d.ts.map