'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _AbstractQuery = require('../store/AbstractQuery');

var _AbstractQuery2 = _interopRequireDefault(_AbstractQuery);

var _extendedJson = require('../extended-json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('liwi:websocket-client:query');

let Query = class extends _AbstractQuery2.default {
  constructor(store, key) {
    super(store);
    this.key = key;
  }

  fetch(callback) {
    return this.store.emit('fetch', this.key).then(callback);
  }

  _subscribe(callback, _includeInitial = false, args) {
    const eventName = `subscribe:${this.store.restName}.${this.key}`;
    const listener = (err, result) => {
      const decodedResult = result && (0, _extendedJson.decode)(result);

      callback(err, decodedResult);
    };
    this.store.connection.on(eventName, listener);

    let _stopEmitSubscribe;
    let promise = this.store.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', this.key, eventName, args).then(stopEmitSubscribe => {
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
      then: cb => Promise.resolve(promise).then(cb)
    };
  }
};
exports.default = Query;
//# sourceMappingURL=Query.js.map