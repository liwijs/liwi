import Logger from 'nightingale-logger';
import AbstractQuery from '../store/AbstractQuery';

import { decode } from '../extended-json';

const logger = new Logger('liwi:websocket-client:query');

let Query = class extends AbstractQuery {
  constructor(store, key) {
    super(store), this.key = key;
  }

  fetch(callback) {
    return this.store.emit('fetch', this.key).then(callback);
  }

  _subscribe(callback, _includeInitial = false, args) {
    var _this = this;

    const eventName = `subscribe:${this.store.restName}.${this.key}`;
    const listener = function listener(err, result) {
      const decodedResult = result && decode(result);
      false, callback(err, decodedResult);
    };
    this.store.connection.on(eventName, listener);


    let _stopEmitSubscribe;
    let promise = this.store.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', this.key, eventName, args).then(function (stopEmitSubscribe) {
      _stopEmitSubscribe = stopEmitSubscribe, logger.info('subscribed');
    }).catch(function (err) {
      throw _this.store.connection.off(eventName, listener), err;
    });

    const stop = function stop() {
      promise && (_stopEmitSubscribe(), promise.then(function () {
        promise = null, _this.store.connection.off(eventName, listener);
      }));
    };

    return {
      cancel: stop,
      stop,
      then: function then(cb) {
        return Promise.resolve(promise).then(cb);
      }
    };
  }
};
export { Query as default };
//# sourceMappingURL=Query.js.map