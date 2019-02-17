import { BaseModel, Changes, Fields, Criteria, Sort } from 'liwi-types';

export interface QueryOptions<Model extends BaseModel> {
  fields?: Fields<Model>;
  criteria?: Criteria<Model>;
  sort?: Sort<Model>;
}

export interface SubscribeResult<Value> {
  cancel: () => void;
  stop: () => void;
  then: (
    onFulfilled: (value: Value) => any,
    onRejected?: (error: any) => any,
  ) => Promise<any>;
}

export type SubscribeCallback<Value> = (
  err: Error | null,
  changes: Changes<Value>,
) => void;

export default abstract class AbstractQuery<Value> {
  abstract fetch(onFulfilled?: (value: Value[]) => any): Promise<any>;

  fetchAndSubscribe(callback: SubscribeCallback<Value>) {
    return this._subscribe(callback, true);
  }

  subscribe(callback: SubscribeCallback<Value>) {
    return this._subscribe(callback, false);
  }

  abstract _subscribe(
    callback: SubscribeCallback<Value>,
    _includeInitial: boolean,
  ): SubscribeResult<Value[]>;
}
