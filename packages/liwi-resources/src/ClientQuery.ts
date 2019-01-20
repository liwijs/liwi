import { PRODUCTION } from 'pob-babel';
import Logger from 'nightingale-logger';
import { decode } from 'extended-json';
import { AbstractQuery } from 'liwi-store';
import { BaseModel } from 'liwi-types';
import AbstractClient from './AbstractClient';

type SubscribeReturn = {
  cancel: () => void;
  stop: () => void;
  then: (cb: any) => Promise<any>;
};

type UnsubscribeCallback = () => void;
type Callback = (err: Error | null, result: any) => void;

const logger = new Logger('liwi:resources:query');

export default class Query<
  Model extends BaseModel,
  KeyPath extends string
> extends AbstractQuery<Model> {
  client: AbstractClient<Model, KeyPath>;

  key: string;

  constructor(client: AbstractClient<Model, KeyPath>, key: string) {
    super();
    this.client = client;
    this.key = key;
  }

  fetch(onFulfilled?: (value: any) => any): Promise<any> {
    return this.client.send('fetch', this.key).then(onFulfilled);
  }

  _subscribe(
    callback: Callback,
    _includeInitial = false,
    args: Array<any>,
  ): SubscribeReturn {
    const eventName = `subscribe:${this.client.resourceName}.${this.key}`;
    const listener = (err: Error | null, result?: string) => {
      const decodedResult = result && decode(result);
      if (!PRODUCTION) logger.debug(eventName, { result, decodedResult });
      callback(err, decodedResult);
    };

    this.client.on(eventName, listener);

    let _stopEmitSubscribe: UnsubscribeCallback;
    let promise: Promise<void> | undefined = this.client
      .emitSubscribe(
        _includeInitial ? 'fetchAndSubscribe' : 'subscribe',
        this.key,
        eventName,
        args,
      )
      .then((stopEmitSubscribe: UnsubscribeCallback) => {
        _stopEmitSubscribe = stopEmitSubscribe;
        logger.info('subscribed');
      })
      .catch((err: Error) => {
        this.client.off(eventName, listener);
        throw err;
      });

    const stop = () => {
      if (!promise) return;
      _stopEmitSubscribe();
      promise.then(() => {
        promise = undefined;
        this.client.off(eventName, listener);
      });
    };

    return {
      cancel: stop,
      stop,
      then: (cb) => Promise.resolve(promise).then(cb),
    };
  }
}
