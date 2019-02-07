import { BaseModel, Changes, Fields, Criteria, Sort } from 'liwi-types';
export interface QueryOptions<Model extends BaseModel> {
    fields?: Fields<Model>;
    criteria?: Criteria<Model>;
    sort?: Sort<Model>;
}
export interface SubscribeResult<Value> {
    cancel: () => void;
    stop: () => void;
    then: (onFulfilled: (value: Value) => any, onRejected?: (error: any) => any) => Promise<any>;
}
export declare type SubscribeCallback<Model> = (err: Error | null, changes: Changes<Model>) => void;
export default abstract class AbstractQuery<Model extends BaseModel> {
    abstract fetch(onFulfilled?: (value: any) => any): Promise<any>;
    fetchAndSubscribe(callback: SubscribeCallback<Model>): SubscribeResult<Model[]>;
    subscribe(callback: SubscribeCallback<Model>): SubscribeResult<Model[]>;
    abstract _subscribe(callback: SubscribeCallback<Model>, _includeInitial: boolean): SubscribeResult<Model[]>;
}
//# sourceMappingURL=AbstractQuery.d.ts.map