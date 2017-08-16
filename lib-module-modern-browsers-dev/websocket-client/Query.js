import Logger from 'nightingale-logger';
import AbstractQuery from '../store/AbstractQuery';
import WebsocketStore from './WebsocketStore';
import { decode } from '../extended-json';

import t from 'flow-runtime';
const SubscribeReturnType = t.type('SubscribeReturnType', t.object(t.property('cancel', t.function()), t.property('stop', t.function())));


const logger = new Logger('liwi:websocket-client:query');

let Query = class extends AbstractQuery {
  constructor(store, key) {
    let _storeType = t.ref(WebsocketStore);

    let _keyType = t.string();

    t.param('store', _storeType).assert(store), t.param('key', _keyType).assert(key), super(store), t.bindTypeParameters(this, t.ref(WebsocketStore)), this.key = key;
  }

  fetch(callback) {
    let _callbackType = t.nullable(t.function());

    const _returnType = t.return(t.any());

    return t.param('callback', _callbackType).assert(callback), this.store.emit('fetch', this.key).then(callback).then(function (_arg) {
      return _returnType.assert(_arg);
    });
  }

  _subscribe(callback, _includeInitial = false, args) {
    var _this = this;

    let _callbackType2 = t.function();

    let _argsType = t.array(t.any());

    const _returnType2 = t.return(SubscribeReturnType);

    t.param('callback', _callbackType2).assert(callback), t.param('args', _argsType).assert(args);

    const eventName = `subscribe:${this.store.restName}.${this.key}`;
    const listener = function listener(err, result) {
      const decodedResult = result && decode(result);
      logger.debug(eventName, { result, decodedResult }), callback(err, decodedResult);
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

    return _returnType2.assert({
      cancel: stop,
      stop,
      then: function then(cb) {
        return Promise.resolve(promise).then(cb);
      }
    });
  }
};
export { Query as default };
//# sourceMappingURL=Query.js.map