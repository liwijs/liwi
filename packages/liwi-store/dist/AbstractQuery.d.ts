import AbstractStore from './AbstractStore';
export interface SubscribeResult {
    cancel: () => void;
    stop: () => void;
    then: (cb: any) => Promise<any>;
}
export declare type Callback = (err: Error | null, result: any) => void;
export default abstract class AbstractQuery<Store extends AbstractStore<any, any, any, any>> {
    store: Store;
    constructor(store: Store);
    abstract fetch(onFulfilled?: (value: any) => any): Promise<any>;
    fetchAndSubscribe(callback: Callback, ...args: Array<any>): SubscribeResult;
    subscribe(callback: Callback, ...args: Array<any>): SubscribeResult;
    abstract _subscribe(callback: Callback, _includeInitial: boolean, args: Array<any>): SubscribeResult;
}
//# sourceMappingURL=AbstractQuery.d.ts.map