import type { Query, QueryParams } from './Query';
import type { SubscribableStore } from './SubscribableStore';
import type { AllowedKeyValue, BaseModel } from './types';
export interface SubscribableStoreQuery<KeyPath extends keyof Model, KeyValue extends AllowedKeyValue, Model extends BaseModel & Record<KeyPath, KeyValue>, SubscribeStore extends SubscribableStore<KeyPath, KeyValue, Model, any, any>, Result, Params extends QueryParams<Params>> extends Query<Result, Params, KeyValue> {
    setSubscribeStore: (store: SubscribeStore) => void;
    getSubscribeStore: () => SubscribeStore;
}
//# sourceMappingURL=SubscribableStoreQuery.d.ts.map