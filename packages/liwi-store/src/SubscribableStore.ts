import {
  BaseModel,
  InsertType,
  QueryOptions,
  Transformer,
  AllowedKeyValue,
} from 'liwi-types';
import AbstractConnection from './AbstractConnection';
import { Store } from './Store';
import { SubscribableStoreQuery } from './SubscribableStoreQuery';

export interface SubscribableStore<
  KeyPath extends string,
  KeyValue extends AllowedKeyValue,
  Model extends BaseModel & Record<KeyPath, KeyValue>,
  ModelInsertType extends InsertType<Model, KeyPath>,
  Connection extends AbstractConnection
> extends Store<KeyPath, KeyValue, Model, ModelInsertType, Connection> {
  createQuerySingleItem<Result extends Record<KeyPath, KeyValue>>(
    options: QueryOptions<Model>,
    transformer?: Transformer<Model, Result>,
  ): SubscribableStoreQuery<any, Result, KeyValue>;

  createQueryCollection<Item extends Record<KeyPath, KeyValue>>(
    options: QueryOptions<Model>,
    transformer?: Transformer<Model, Item>,
  ): SubscribableStoreQuery<any, Item[], KeyValue>;
}
