import Logger from 'nightingale-logger';
import AbstractQuery from '../store/AbstractQuery';

import { decode } from '../msgpack';

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
    this.store.connection.on(eventName, function (err, result) {
      callback(err, decode(result));
    });

    var _stopEmitSubscribe = void 0;
    var promise = this.store.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', this.key, eventName, args).then(function (stopEmitSubscribe) {
      _stopEmitSubscribe = stopEmitSubscribe;
      logger.info('subscribed');
    }).catch(function (err) {
      _this.store.connection.off(eventName, callback);
      throw err;
    });

    var stop = function stop() {
      if (!promise) return;
      _stopEmitSubscribe();
      promise.then(function () {
        promise = null;
        _this.store.connection.off(eventName, callback);
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