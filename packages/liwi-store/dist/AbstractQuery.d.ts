import { BaseModel, Changes } from 'liwi-types';
import StoreInterface from './Store';
export interface SubscribeResult {
    cancel: () => void;
    stop: () => void;
    then: (cb: any) => Promise<any>;
}
export declare type SubscribeCallback<Model> = (err: Error | null, changes: Changes<Model>) => void;
export default abstract class AbstractQuery<Model extends BaseModel, Store extends StoreInterface<Model, any, any, any, any>> {
    store: Store;
    constructor(store: Store);
    abstract fetch(onFulfilled?: (value: any) => any): Promise<any>;
    fetchAndSubscribe(callback: SubscribeCallback<Model>, ...args: Array<any>): SubscribeResult;
    subscribe(callback: SubscribeCallback<Model>, ...args: Array<any>): SubscribeResult;
    abstract _subscribe(callback: SubscribeCallback<Model>, _includeInitial: boolean, args: Array<any>): SubscribeResult;
}
//# sourceMappingURL=AbstractQuery.d.ts.map