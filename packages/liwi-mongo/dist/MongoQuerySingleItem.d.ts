import type { QuerySubscription, SubscribeCallback, QueryResult, QueryParams } from 'liwi-store';
import { AbstractSubscribableStoreQuery } from 'liwi-subscribe-store';
import type { QueryOptions, Transformer, AllowedKeyValue } from 'liwi-types';
import type { MongoBaseModel, MongoInsertType, MongoKeyPath } from './MongoBaseModel';
import type MongoStore from './MongoStore';
declare type TestCriteria = (obj: any) => boolean;
export default class MongoQuerySingleItem<Model extends MongoBaseModel<KeyValue>, Params extends QueryParams<Params> = never, Result extends Record<MongoKeyPath, KeyValue> | null = Model | null, KeyValue extends AllowedKeyValue = Model['_id']> extends AbstractSubscribableStoreQuery<MongoKeyPath, KeyValue, Model, MongoInsertType<Model, KeyValue>, Params, Result> {
    private readonly store;
    private readonly options;
    private testCriteria?;
    private readonly transformer;
    constructor(store: MongoStore<Model, KeyValue>, options: QueryOptions<Model>, transformer?: Transformer<Model, Result>);
    createMingoTestCriteria(): TestCriteria;
    fetch<T>(onFulfilled: (result: QueryResult<Result>) => T): Promise<T>;
    _subscribe(callback: SubscribeCallback<KeyValue, Result>, _includeInitial: boolean): QuerySubscription;
    private createMongoCursor;
}
export {};
//# sourceMappingURL=MongoQuerySingleItem.d.ts.map