import type { AllowedKeyValue, QueryOptions, QueryParams, QueryResult, QuerySubscription, SubscribeCallback, Transformer } from "liwi-store";
import { AbstractSubscribableStoreQuery } from "liwi-subscribe-store";
import type { MongoBaseModel, MongoInsertType, MongoKeyPath } from "./MongoBaseModel";
import type MongoStore from "./MongoStore";
type TestCriteria = (obj: any) => boolean;
export default class MongoQueryCollection<Model extends MongoBaseModel<KeyValue>, Params extends QueryParams<Params> = never, KeyValue extends AllowedKeyValue = Model["_id"], Item extends Record<MongoKeyPath, KeyValue> = Model> extends AbstractSubscribableStoreQuery<MongoKeyPath, KeyValue, Model, MongoInsertType<Model, KeyValue>, Params, Item[]> {
    private readonly store;
    private readonly options;
    private testCriteria?;
    private readonly transformer;
    constructor(store: MongoStore<Model, KeyValue>, options: QueryOptions<Model>, transformer?: Transformer<Model, Item>);
    createTestCriteria(): TestCriteria;
    fetch<T>(onFulfilled: (result: QueryResult<Item[]>) => T): Promise<T>;
    _subscribe(callback: SubscribeCallback<KeyValue, Item[]>, _includeInitial: boolean): QuerySubscription;
    private createMongoCursor;
}
export {};
//# sourceMappingURL=MongoQueryCollection.d.ts.map