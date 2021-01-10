import type {
  BaseModel,
  InsertType,
  QueryOptions,
  Transformer,
  AllowedKeyValue,
} from 'liwi-types';
import type AbstractConnection from './AbstractConnection';
import type { QueryParams } from './Query';
import type { Store } from './Store';
import type { SubscribableStoreQuery } from './SubscribableStoreQuery';

export interface SubscribableStore<
  KeyPath extends string,
  KeyValue extends AllowedKeyValue,
  Model extends BaseModel & Record<KeyPath, KeyValue>,
  ModelInsertType extends InsertType<Model, KeyPath>,
  Connection extends AbstractConnection
> extends Store<KeyPath, KeyValue, Model, ModelInsertType, Connection> {
  createQuerySingleItem: <
    Result extends Record<KeyPath, KeyValue>,
    Params extends QueryParams<Params>
  >(
    options: QueryOptions<Model>,
    transformer?: Transformer<Model, Result>,
  ) => SubscribableStoreQuery<any, Result, Params, KeyValue>;

  createQueryCollection: <
    Item extends Record<KeyPath, KeyValue>,
    Params extends QueryParams<Params>
  >(
    options: QueryOptions<Model>,
    transformer?: Transformer<Model, Item>,
  ) => SubscribableStoreQuery<any, Item[], Params, KeyValue>;
}
