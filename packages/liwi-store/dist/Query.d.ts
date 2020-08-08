import { BaseModel, Changes, Fields, Criteria, Sort, AllowedKeyValue, QueryMeta, QueryInfo } from 'liwi-types';
export type { QueryMeta, QueryInfo } from 'liwi-types';
export interface QueryOptions<Model extends BaseModel> {
    fields?: Fields<Model>;
    criteria?: Criteria<Model>;
    sort?: Sort<Model>;
}
export interface QuerySubscription extends PromiseLike<void> {
    cancel: () => void;
    stop: () => void;
}
export declare type SubscribeCallback<KeyValue extends AllowedKeyValue, Result> = (err: Error | null, changes: Changes<KeyValue, Result>) => unknown;
export declare type AllowedParamValue = undefined | null | string | number | boolean | Date | AllowedParamValue[];
export declare type QueryParams<Params> = Record<keyof Params, AllowedParamValue> | undefined;
export interface QueryResult<Result> {
    result: Result;
    info: QueryInfo<any>;
    meta: QueryMeta;
}
export interface Query<Result, Params extends QueryParams<Params>, KeyValue extends AllowedKeyValue = AllowedKeyValue> {
    changePartialParams(params: Partial<Params>): void;
    fetch<T>(onFulfilled: (result: QueryResult<Result>) => T): Promise<T>;
    fetchAndSubscribe(callback: SubscribeCallback<KeyValue, Result>): QuerySubscription;
    subscribe(callback: SubscribeCallback<KeyValue, Result>): QuerySubscription;
}
//# sourceMappingURL=Query.d.ts.map