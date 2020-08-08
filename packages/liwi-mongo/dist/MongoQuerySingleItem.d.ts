import { QuerySubscription, SubscribeCallback, QueryResult } from 'liwi-store';
import { AbstractSubscribableStoreQuery } from 'liwi-subscribe-store';
import { QueryOptions, Transformer, AllowedKeyValue } from 'liwi-types';
import { MongoBaseModel, MongoInsertType, MongoKeyPath } from './MongoBaseModel';
import MongoStore from './MongoStore';
interface TestCriteria {
    test(obj: any): boolean;
}
export default class MongoQuerySingleItem<Model extends MongoBaseModel<KeyValue>, Result extends Record<MongoKeyPath, KeyValue> | null = Model | null, KeyValue extends AllowedKeyValue = Model['_id'], ModelInsertType extends MongoInsertType<Model, KeyValue> = MongoInsertType<Model, KeyValue>> extends AbstractSubscribableStoreQuery<MongoKeyPath, KeyValue, Model, ModelInsertType, Result> {
    private readonly store;
    private readonly options;
    private mingoQuery?;
    private readonly transformer;
    constructor(store: MongoStore<Model, KeyValue, ModelInsertType>, options: QueryOptions<Model>, transformer?: Transformer<Model, Result>);
    createMingoQuery(): TestCriteria;
    fetch<T>(onFulfilled: (result: QueryResult<Result>) => T): Promise<T>;
    _subscribe(callback: SubscribeCallback<KeyValue, Result>, _includeInitial: boolean): QuerySubscription;
    private createMongoCursor;
}
export {};
//# sourceMappingURL=MongoQuerySingleItem.d.ts.map