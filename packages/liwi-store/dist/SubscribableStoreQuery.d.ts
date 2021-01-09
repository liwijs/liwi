import type { AllowedKeyValue } from 'liwi-types';
import type { Query, QueryParams } from './Query';
import type { SubscribableStore } from './SubscribableStore';
export interface SubscribableStoreQuery<SubscribeStore extends SubscribableStore<any, any, any, any, any>, Result, Params extends QueryParams<Params>, KeyValue extends AllowedKeyValue> extends Query<Result, Params, KeyValue> {
    setSubscribeStore: (store: SubscribeStore) => void;
    getSubscribeStore: () => SubscribeStore;
}
//# sourceMappingURL=SubscribableStoreQuery.d.ts.map