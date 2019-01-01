import mingo from 'mingo';
import { SubscribeResult, SubscribeCallback } from 'liwi-store';
import { Criteria, Sort } from 'liwi-types';
import { AbstractSubscribeQuery } from 'liwi-subscribe-store';
import MongoStore, { MongoModel } from './MongoStore';
export default class MongoQuery<Model extends MongoModel> extends AbstractSubscribeQuery<Model, MongoStore<Model>> {
    private readonly criteria;
    private readonly sort?;
    private mingoQuery?;
    constructor(store: MongoStore<Model>, criteria: Criteria<Model>, sort?: Sort<Model>);
    getMingoQuery(): mingo.Query;
    fetch<T>(onFulfilled: (result: Array<Model>) => T): Promise<T>;
    _subscribe(callback: SubscribeCallback<Model>, _includeInitial: boolean, args: Array<any>): SubscribeResult;
}
//# sourceMappingURL=MongoQuery.d.ts.map