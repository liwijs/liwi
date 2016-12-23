import Logger from 'nightingale-logger';
import AbstractQuery from '../store/AbstractQuery';
import WebsocketStore from './WebsocketStore';
import { decode } from '../extended-json';

type SubscribeReturnType = {
  cancel: Function,
  stop: Function,
};

const logger = new Logger('liwi:websocket-client:query');

export default class Query extends AbstractQuery<WebsocketStore> {
  constructor(store: WebsocketStore, key: string) {
    super(store);
    this.key = key;
  }

  fetch(callback: ?Function): Promise {
    return this.store.emit('fetch', this.key).then(callback);
  }

  _subscribe(callback: Function, _includeInitial = false, args: Array<any>): SubscribeReturnType {
    const eventName = `subscribe:${this.store.restName}.${this.key}`;
    const listener = (err, result) => {
      const decodedResult = result && decode(result);
      if (!PRODUCTION) logger.debug(eventName, { result, decodedResult });
      callback(err, decodedResult);
    };
    this.store.connection.on(eventName, listener);

    let _stopEmitSubscribe;
    let promise = this.store.emitSubscribe(
      _includeInitial ? 'fetchAndSubscribe' : 'subscribe',
      this.key,
      eventName,
      args,
    ).then(stopEmitSubscribe => {
      _stopEmitSubscribe = stopEmitSubscribe;
      logger.info('subscribed');
    }).catch(err => {
      this.store.connection.off(eventName, listener);
      throw err;
    });

    const stop = () => {
      if (!promise) return;
      _stopEmitSubscribe();
      promise.then(() => {
        promise = null;
        this.store.connection.off(eventName, listener);
      });
    };

    return {
      cancel: stop,
      stop,
      then: cb => Promise.resolve(promise).then(cb),
    };
  }
}
