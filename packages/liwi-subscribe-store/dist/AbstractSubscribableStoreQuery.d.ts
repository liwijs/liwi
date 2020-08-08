import { Query, SubscribeCallback, QuerySubscription, QueryResult } from 'liwi-store';
import { BaseModel, InsertType, AllowedKeyValue } from 'liwi-types';
import SubscribeStore from './SubscribeStore';
export default abstract class AbstractSubscribableStoreQuery<KeyPath extends string, KeyValue extends AllowedKeyValue, Model extends BaseModel & Record<KeyPath, KeyValue>, ModelInsertType extends InsertType<Model, KeyPath>, Result = Model> implements Query<Result, never, KeyValue> {
    changeParams(params: never): never;
    changePartialParams(params: never): never;
    private _subscribeStore?;
    setSubscribeStore(store: SubscribeStore<KeyPath, KeyValue, Model, ModelInsertType, any, any>): void;
    getSubscribeStore(): SubscribeStore<KeyPath, KeyValue, Model, ModelInsertType, any, any>;
    abstract fetch<T>(onFulfilled: (result: QueryResult<Result>) => T): Promise<T>;
    fetchAndSubscribe(callback: SubscribeCallback<KeyValue, Result>): QuerySubscription;
    subscribe(callback: SubscribeCallback<KeyValue, Result>): QuerySubscription;
    abstract _subscribe(callback: SubscribeCallback<KeyValue, Result>, _includeInitial: boolean): QuerySubscription;
}
//# sourceMappingURL=AbstractSubscribableStoreQuery.d.ts.map