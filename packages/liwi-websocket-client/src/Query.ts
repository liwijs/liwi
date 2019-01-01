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

type UnsubscribeCallback = () => void;
type Callback = (err: Error | null, result: any) => void;

const logger = new Logger('liwi:websocket-client:query');

export default class Query<
  Model extends BaseModel,
  KeyPath extends string
> extends AbstractQuery<Model, WebsocketStore<Model, KeyPath>> {
  key: string;

  constructor(store: WebsocketStore<Model, KeyPath>, key: string) {
    super(store);
    this.key = key;
  }

  fetch(onFulfilled?: (value: any) => any): Promise<any> {
    return super.store.emit('fetch', this.key).then(onFulfilled);
  }

  _subscribe(
    callback: Callback,
    _includeInitial = false,
    args: Array<any>,
  ): SubscribeReturn {
    const eventName = `subscribe:${super.store.restName}.${this.key}`;
    const listener = (err: Error | null, result?: string) => {
      const decodedResult = result && decode(result);
      if (!PRODUCTION) logger.debug(eventName, { result, decodedResult });
      callback(err, decodedResult);
    };

    const connection = super.store.connection;

    connection.on(eventName, listener);

    let _stopEmitSubscribe: UnsubscribeCallback;
    let promise: Promise<void> | undefined = super.store
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
        connection.off(eventName, listener);
        throw err;
      });

    const stop = () => {
      if (!promise) return;
      _stopEmitSubscribe();
      promise.then(() => {
        promise = undefined;
        connection.off(eventName, listener);
      });
    };

    return {
      cancel: stop,
      stop,
      then: (cb) => Promise.resolve(promise).then(cb),
    };
  }
}
