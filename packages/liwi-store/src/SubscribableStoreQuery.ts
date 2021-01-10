import type { AllowedKeyValue, BaseModel } from 'liwi-types';
import type { Query, QueryParams } from './Query';
import type { SubscribableStore } from './SubscribableStore';

export interface SubscribableStoreQuery<
  KeyPath extends keyof Model,
  KeyValue extends AllowedKeyValue,
  Model extends BaseModel & Record<KeyPath, KeyValue>,
  SubscribeStore extends SubscribableStore<KeyPath, KeyValue, Model, any, any>,
  Result,
  Params extends QueryParams<Params>
> extends Query<Result, Params, KeyValue> {
  setSubscribeStore: (store: SubscribeStore) => void;

  getSubscribeStore: () => SubscribeStore;
}
