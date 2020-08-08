import { AllowedKeyValue } from 'liwi-types';
import { Query } from './Query';
import { SubscribableStore } from './SubscribableStore';
export interface SubscribableStoreQuery<SubscribeStore extends SubscribableStore<any, any, any, any, any>, Result, KeyValue extends AllowedKeyValue> extends Query<Result, never, KeyValue> {
    setSubscribeStore(store: SubscribeStore): void;
    getSubscribeStore(): SubscribeStore;
}
//# sourceMappingURL=SubscribableStoreQuery.d.ts.map