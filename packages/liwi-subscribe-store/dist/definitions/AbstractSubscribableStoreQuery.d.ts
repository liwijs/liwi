import type { AllowedKeyValue, BaseModel, InsertType, Query, QueryParams, QueryResult, QuerySubscription, SubscribeCallback } from "liwi-store";
import type SubscribeStore from "./SubscribeStore";
export default abstract class AbstractSubscribableStoreQuery<KeyPath extends keyof Model, KeyValue extends AllowedKeyValue, Model extends BaseModel & Record<KeyPath, KeyValue>, ModelInsertType extends InsertType<Model, KeyPath>, Params extends QueryParams<Params> = never, Result = Model> implements Query<Result, Params, KeyValue> {
    changeParams(params: Params): never;
    changePartialParams(params: Params extends undefined ? never : Partial<Params>): never;
    private _subscribeStore?;
    setSubscribeStore(store: SubscribeStore<KeyPath, KeyValue, Model, ModelInsertType, any, any>): void;
    getSubscribeStore(): SubscribeStore<KeyPath, KeyValue, Model, ModelInsertType, any, any>;
    abstract fetch<T>(onFulfilled: (result: QueryResult<Result>) => T): Promise<T>;
    fetchAndSubscribe(callback: SubscribeCallback<KeyValue, Result>): QuerySubscription;
    subscribe(callback: SubscribeCallback<KeyValue, Result>): QuerySubscription;
    abstract _subscribe(callback: SubscribeCallback<KeyValue, Result>, _includeInitial: boolean): QuerySubscription;
}
//# sourceMappingURL=AbstractSubscribableStoreQuery.d.ts.map