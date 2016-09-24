import _t from 'tcomb-forked';
import Logger from 'nightingale-logger';
import AbstractQuery from '../store/AbstractQuery';
import WebsocketStore from './WebsocketStore';
import { decode } from '../msgpack';

var SubscribeReturnType = _t.interface({
  cancel: _t.Function,
  stop: _t.Function
}, 'SubscribeReturnType');

var logger = new Logger('liwi.websocket-client.query');

export default class Query extends AbstractQuery {
  constructor(store, key) {
    _assert(store, WebsocketStore, 'store');

    _assert(key, _t.String, 'key');

    super(store);
    this.key = key;
  }

  fetch(callback) {
    _assert(callback, _t.maybe(_t.Function), 'callback');

    return _assert(function () {
      return this.store.emit('fetch', this.key).then(callback);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  _subscribe(callback) {
    var _includeInitial = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var args = arguments[2];

    _assert(callback, _t.Function, 'callback');

    _assert(args, _t.list(_t.Any), 'args');

    return _assert(function () {
      var eventName = `subscribe:${ this.store.restName }.${ this.key }`;
      this.store.connection.on(eventName, (err, result) => {
        callback(err, decode(result));
      });

      var _stopEmitSubscribe = undefined;
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
    }.apply(this, arguments), SubscribeReturnType, 'return value');
  }
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }

    return type(x);
  }

  if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=Query.js.map