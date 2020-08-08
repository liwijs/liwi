import { QuerySubscription, SubscribeCallback, QueryResult } from 'liwi-store';
import { AbstractSubscribableStoreQuery } from 'liwi-subscribe-store';
import { QueryOptions, Transformer, AllowedKeyValue } from 'liwi-types';
import { MongoBaseModel, MongoInsertType, MongoKeyPath } from './MongoBaseModel';
import MongoStore from './MongoStore';
declare type TestCriteria = (obj: any) => boolean;
export default class MongoQueryCollection<Model extends MongoBaseModel<KeyValue>, KeyValue extends AllowedKeyValue = Model['_id'], ModelInsertType extends MongoInsertType<Model> = MongoInsertType<Model>, Item extends Record<MongoKeyPath, KeyValue> = Model> extends AbstractSubscribableStoreQuery<MongoKeyPath, KeyValue, Model, ModelInsertType, Item[]> {
    private readonly store;
    private readonly options;
    private testCriteria?;
    private readonly transformer;
    constructor(store: MongoStore<Model, KeyValue, ModelInsertType>, options: QueryOptions<Model>, transformer?: Transformer<Model, Item>);
    createTestCriteria(): TestCriteria;
    fetch<T>(onFulfilled: (result: QueryResult<Item[]>) => T): Promise<T>;
    _subscribe(callback: SubscribeCallback<KeyValue, Item[]>, _includeInitial: boolean): QuerySubscription;
    private createMongoCursor;
}
export {};
//# sourceMappingURL=MongoQueryCollection.d.ts.map