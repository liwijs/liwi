import Logger from 'nightingale-logger';
import AbstractQuery from '../store/AbstractQuery';

import { decode } from '../extended-json';

var logger = new Logger('liwi:websocket-client:query');

export default class Query extends AbstractQuery {
  constructor(store, key) {
    super(store);
    this.key = key;
  }

  fetch(callback) {
    return this.store.emit('fetch', this.key).then(callback);
  }

  _subscribe(callback, _includeInitial = false, args) {
    var _this = this;

    var eventName = `subscribe:${ this.store.restName }.${ this.key }`;
    var listener = function listener(err, result) {
      var decodedResult = result && decode(result);

      callback(err, decodedResult);
    };
    this.store.connection.on(eventName, listener);

    var _stopEmitSubscribe = void 0;
    var promise = this.store.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', this.key, eventName, args).then(function (stopEmitSubscribe) {
      _stopEmitSubscribe = stopEmitSubscribe;
      logger.info('subscribed');
    }).catch(function (err) {
      _this.store.connection.off(eventName, listener);
      throw err;
    });

    var stop = function stop() {
      if (!promise) return;
      _stopEmitSubscribe();
      promise.then(function () {
        promise = null;
        _this.store.connection.off(eventName, listener);
      });
    };

    return {
      cancel: stop,
      stop,
      then: function then(cb) {
        return Promise.resolve(promise).then(cb);
      }
    };
  }
}
//# sourceMappingURL=Query.js.map