import AbstractStore from './AbstractStore';

export interface SubscribeResult {
  cancel: () => void;
  stop: () => void;
  then: (cb: any) => Promise<any>;
}

export type Callback = (err: Error | null, result: any) => void;

export default abstract class AbstractQuery<
  Store extends AbstractStore<any, any, any, any>
> {
  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  abstract fetch(onFulfilled?: (value: any) => any): Promise<any>;

  fetchAndSubscribe(callback: Callback, ...args: Array<any>) {
    return this._subscribe(callback, true, args);
  }

  subscribe(callback: Callback, ...args: Array<any>) {
    return this._subscribe(callback, false, args);
  }

  abstract _subscribe(
    callback: Callback,
    _includeInitial: boolean,
    args: Array<any>,
  ): SubscribeResult;
}
