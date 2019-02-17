import mingo from 'mingo';
import { SubscribeResult, SubscribeCallback } from 'liwi-store';
import { QueryOptions } from 'liwi-types';
import { AbstractSubscribeQuery } from 'liwi-subscribe-store';
import MongoStore, { MongoModel } from './MongoStore';
declare type Transformer<Model extends MongoModel, Transformed = Model> = (model: Model) => Transformed;
export default class MongoQuery<Model extends MongoModel, Transformed = Model> extends AbstractSubscribeQuery<Model, MongoStore<Model>, Transformed> {
    private readonly store;
    private readonly options;
    private mingoQuery?;
    private readonly transformer;
    constructor(store: MongoStore<Model>, options: QueryOptions<Model>, transformer?: Transformer<Model, Transformed>);
    createMingoQuery(): mingo.Query;
    fetch<T>(onFulfilled: (result: Transformed[]) => T): Promise<T>;
    _subscribe(callback: SubscribeCallback<Transformed>, _includeInitial: boolean): SubscribeResult<Transformed[]>;
    private createMongoCursor;
}
export {};
//# sourceMappingURL=MongoQuery.d.ts.map