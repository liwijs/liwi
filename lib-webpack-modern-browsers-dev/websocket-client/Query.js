import _t from 'tcomb-forked';
import Logger from 'nightingale-logger';
import AbstractQuery from '../store/AbstractQuery';
import WebsocketStore from './WebsocketStore';
import { decode } from '../extended-json';

var SubscribeReturnType = _t.interface({
  cancel: _t.Function,
  stop: _t.Function
}, 'SubscribeReturnType');

var logger = new Logger('liwi:websocket-client:query');

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

  _subscribe(callback, _includeInitial = false, args) {
    _assert(callback, _t.Function, 'callback');

    _assert(args, _t.list(_t.Any), 'args');

    return _assert(function () {
      var _this = this;

      var eventName = `subscribe:${ this.store.restName }.${ this.key }`;
      var listener = function listener(err, result) {
        var decodedResult = result && decode(result);
        logger.debug(eventName, { result, decodedResult });
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
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=Query.js.map