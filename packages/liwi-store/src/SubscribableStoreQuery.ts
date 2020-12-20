import type { AllowedKeyValue } from 'liwi-types';
import type { Query } from './Query';
import type { SubscribableStore } from './SubscribableStore';

export interface SubscribableStoreQuery<
  SubscribeStore extends SubscribableStore<any, any, any, any, any>,
  Result,
  KeyValue extends AllowedKeyValue
> extends Query<Result, never, KeyValue> {
  setSubscribeStore: (store: SubscribeStore) => void;

  getSubscribeStore: () => SubscribeStore;
}
