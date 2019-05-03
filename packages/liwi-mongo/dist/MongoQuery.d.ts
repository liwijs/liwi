import { SubscribeResult, SubscribeCallback } from 'liwi-store';
import { QueryOptions, Transformer } from 'liwi-types';
import { AbstractSubscribeQuery } from 'liwi-subscribe-store';
import MongoStore, { MongoModel } from './MongoStore';
interface TestCriteria {
    test(obj: any): boolean;
}
export default class MongoQuery<Model extends MongoModel, Transformed = Model> extends AbstractSubscribeQuery<Model, MongoStore<Model>, Transformed> {
    private readonly store;
    private readonly options;
    private mingoQuery?;
    private readonly transformer;
    constructor(store: MongoStore<Model>, options: QueryOptions<Model>, transformer?: Transformer<Model, Transformed>);
    createMingoQuery(): TestCriteria;
    fetch<T>(onFulfilled: (result: Transformed[]) => T): Promise<T>;
    _subscribe(callback: SubscribeCallback<Transformed>, _includeInitial: boolean): SubscribeResult<Transformed[]>;
    private createMongoCursor;
}
export {};
//# sourceMappingURL=MongoQuery.d.ts.map