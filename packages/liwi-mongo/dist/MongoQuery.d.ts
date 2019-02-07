import mingo from 'mingo';
import { SubscribeResult, SubscribeCallback } from 'liwi-store';
import { QueryOptions } from 'liwi-types';
import { AbstractSubscribeQuery } from 'liwi-subscribe-store';
import MongoStore, { MongoModel } from './MongoStore';
export default class MongoQuery<Model extends MongoModel> extends AbstractSubscribeQuery<Model, MongoStore<Model>> {
    private readonly store;
    private readonly options;
    private mingoQuery?;
    constructor(store: MongoStore<Model>, options: QueryOptions<Model>);
    createMingoQuery(): mingo.Query;
    fetch<T>(onFulfilled: (result: Model[]) => T): Promise<T>;
    _subscribe(callback: SubscribeCallback<Model>, _includeInitial: boolean): SubscribeResult<Model[]>;
    private createMongoCursor;
}
//# sourceMappingURL=MongoQuery.d.ts.map