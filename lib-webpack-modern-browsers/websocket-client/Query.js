import Logger from 'nightingale-logger';
import AbstractQuery from '../store/AbstractQuery';

import { decode } from '../msgpack';

var logger = new Logger('liwi.websocket-client.query');

export default class Query extends AbstractQuery {
  constructor(store, key) {
    super(store);
    this.key = key;
  }

  fetch(callback) {
    return this.store.emit('fetch', this.key).then(callback);
  }

  _subscribe(callback) {
    var _includeInitial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var args = arguments[2];

    var eventName = `subscribe:${ this.store.restName }.${ this.key }`;
    this.store.connection.on(eventName, (err, result) => {
      callback(err, decode(result));
    });

    var _stopEmitSubscribe = void 0;
    var promise = this.store.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', this.key, eventName, args).then(stopEmitSubscribe => {
      _stopEmitSubscribe = stopEmitSubscribe;
      logger.info('subscribed');
    }).catch(err => {
      this.store.connection.off(eventName, callback);
      throw err;
    });

    var stop = () => {
      if (!promise) return;
      _stopEmitSubscribe();
      promise.then(() => {
        promise = null;
        this.store.connection.off(eventName, callback);
      });
    };

    return {
      cancel: stop,
      stop,
      then: cb => Promise.resolve(promise).then(cb)
    };
  }
}
//# sourceMappingURL=Query.js.map