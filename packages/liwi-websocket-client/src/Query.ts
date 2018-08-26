import { PRODUCTION } from 'pob-babel';
import Logger from 'nightingale-logger';
import { decode } from 'extended-json';
import { AbstractQuery } from 'liwi-store';
import { BaseModel } from 'liwi-types';
import WebsocketStore from './WebsocketStore';

type SubscribeReturn = {
  cancel: () => void;
  stop: () => void;
  then: (cb: any) => Promise<any>;
};

type Callback = (err: Error | null, result: any) => void;

const logger = new Logger('liwi:websocket-client:query');

export default class Query<
  Model extends BaseModel,
  KeyPath extends string
> extends AbstractQuery<WebsocketStore<Model, KeyPath>> {
  key: string;

  constructor(store: WebsocketStore<Model, KeyPath>, key: string) {
    super(store);
    this.key = key;
  }

  fetch(onFulfilled?: (value: any) => any): Promise<any> {
    return this.store.emit('fetch', this.key).then(onFulfilled);
  }

  _subscribe(
    callback: Callback,
    _includeInitial = false,
    args: Array<any>,
  ): SubscribeReturn {
    const eventName = `subscribe:${this.store.restName}.${this.key}`;
    const listener = (err: Error | null, result?: string) => {
      const decodedResult = result && decode(result);
      if (!PRODUCTION) logger.debug(eventName, { result, decodedResult });
      callback(err, decodedResult);
    };
    this.store.connection.on(eventName, listener);

    let _stopEmitSubscribe: () => void;
    let promise: Promise<void> | undefined = this.store
      .emitSubscribe(
        _includeInitial ? 'fetchAndSubscribe' : 'subscribe',
        this.key,
        eventName,
        args,
      )
      .then((stopEmitSubscribe) => {
        _stopEmitSubscribe = stopEmitSubscribe;
        logger.info('subscribed');
      })
      .catch((err) => {
        this.store.connection.off(eventName, listener);
        throw err;
      });

    const stop = () => {
      if (!promise) return;
      _stopEmitSubscribe();
      promise.then(() => {
        promise = undefined;
        this.store.connection.off(eventName, listener);
      });
    };

    return {
      cancel: stop,
      stop,
      then: (cb) => Promise.resolve(promise).then(cb),
    };
  }
}
