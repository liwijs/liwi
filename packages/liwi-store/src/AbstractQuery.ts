import { BaseModel, Changes, Fields, Criteria, Sort } from 'liwi-types';

export interface QueryOptions<Model extends BaseModel> {
  fields?: Fields<Model>;
  criteria?: Criteria<Model>;
  sort?: Sort<Model>;
}

export interface SubscribeResult {
  cancel: () => void;
  stop: () => void;
  then: (cb: any) => Promise<any>;
}

export type SubscribeCallback<Model> = (
  err: Error | null,
  changes: Changes<Model>,
) => void;

export default abstract class AbstractQuery<Model extends BaseModel> {
  abstract fetch(onFulfilled?: (value: any) => any): Promise<any>;

  fetchAndSubscribe(callback: SubscribeCallback<Model>, ...args: any[]) {
    return this._subscribe(callback, true, args);
  }

  subscribe(callback: SubscribeCallback<Model>, ...args: any[]) {
    return this._subscribe(callback, false, args);
  }

  abstract _subscribe(
    callback: SubscribeCallback<Model>,
    _includeInitial: boolean,
    args: any[],
  ): SubscribeResult;
}
