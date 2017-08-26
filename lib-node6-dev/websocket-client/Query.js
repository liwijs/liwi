'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _AbstractQuery = require('../store/AbstractQuery');

var _AbstractQuery2 = _interopRequireDefault(_AbstractQuery);

var _WebsocketStore = require('./WebsocketStore');

var _WebsocketStore2 = _interopRequireDefault(_WebsocketStore);

var _extendedJson = require('../extended-json');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SubscribeReturnType = _flowRuntime2.default.type('SubscribeReturnType', _flowRuntime2.default.object(_flowRuntime2.default.property('cancel', _flowRuntime2.default.function()), _flowRuntime2.default.property('stop', _flowRuntime2.default.function())));

const logger = new _nightingaleLogger2.default('liwi:websocket-client:query');

let Query = class extends _AbstractQuery2.default {
  constructor(store, key) {
    let _storeType = _flowRuntime2.default.ref(_WebsocketStore2.default);

    let _keyType = _flowRuntime2.default.string();

    _flowRuntime2.default.param('store', _storeType).assert(store);

    _flowRuntime2.default.param('key', _keyType).assert(key);

    super(store);

    _flowRuntime2.default.bindTypeParameters(this, _flowRuntime2.default.ref(_WebsocketStore2.default));

    this.key = key;
  }

  fetch(callback) {
    let _callbackType = _flowRuntime2.default.nullable(_flowRuntime2.default.function());

    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.any());

    _flowRuntime2.default.param('callback', _callbackType).assert(callback);

    return this.store.emit('fetch', this.key).then(callback).then(_arg => _returnType.assert(_arg));
  }

  _subscribe(callback, _includeInitial = false, args) {
    let _callbackType2 = _flowRuntime2.default.function();

    let _argsType = _flowRuntime2.default.array(_flowRuntime2.default.any());

    const _returnType2 = _flowRuntime2.default.return(SubscribeReturnType);

    _flowRuntime2.default.param('callback', _callbackType2).assert(callback);

    _flowRuntime2.default.param('args', _argsType).assert(args);

    const eventName = `subscribe:${this.store.restName}.${this.key}`;
    const listener = (err, result) => {
      const decodedResult = result && (0, _extendedJson.decode)(result);
      logger.debug(eventName, { result, decodedResult });
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

    return _returnType2.assert({
      cancel: stop,
      stop,
      then: cb => Promise.resolve(promise).then(cb)
    });
  }
};
exports.default = Query;
//# sourceMappingURL=Query.js.map