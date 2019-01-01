import { BaseModel, Changes } from 'liwi-types';
import StoreInterface from './Store';

export interface SubscribeResult {
  cancel: () => void;
  stop: () => void;
  then: (cb: any) => Promise<any>;
}

export type SubscribeCallback<Model> = (
  err: Error | null,
  changes: Changes<Model>,
) => void;

export default abstract class AbstractQuery<
  Model extends BaseModel,
  Store extends StoreInterface<Model, any, any, any, any>
> {
  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  abstract fetch(onFulfilled?: (value: any) => any): Promise<any>;

  fetchAndSubscribe(callback: SubscribeCallback<Model>, ...args: Array<any>) {
    return this._subscribe(callback, true, args);
  }

  subscribe(callback: SubscribeCallback<Model>, ...args: Array<any>) {
    return this._subscribe(callback, false, args);
  }

  abstract _subscribe(
    callback: SubscribeCallback<Model>,
    _includeInitial: boolean,
    args: Array<any>,
  ): SubscribeResult;
}
