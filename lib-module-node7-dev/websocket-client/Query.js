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

    t.param('store', _storeType).assert(store);
    t.param('key', _keyType).assert(key);

    super(store);
    t.bindTypeParameters(this, t.ref(WebsocketStore));
    this.key = key;
  }

  fetch(callback) {
    let _callbackType = t.nullable(t.function());

    const _returnType = t.return(t.any());

    t.param('callback', _callbackType).assert(callback);

    return this.store.emit('fetch', this.key).then(callback).then(_arg => _returnType.assert(_arg));
  }

  _subscribe(callback, _includeInitial = false, args) {
    let _callbackType2 = t.function();

    let _argsType = t.array(t.any());

    const _returnType2 = t.return(SubscribeReturnType);

    t.param('callback', _callbackType2).assert(callback);
    t.param('args', _argsType).assert(args);

    const eventName = `subscribe:${this.store.restName}.${this.key}`;
    const listener = (err, result) => {
      const decodedResult = result && decode(result);
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
export { Query as default };
//# sourceMappingURL=Query.js.map