'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _AbstractQuery = require('../store/AbstractQuery');

var _AbstractQuery2 = _interopRequireDefault(_AbstractQuery);

var _WebsocketStore = require('./WebsocketStore');

var _WebsocketStore2 = _interopRequireDefault(_WebsocketStore);

var _msgpack = require('../msgpack');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SubscribeReturnType = _tcombForked2.default.interface({
  cancel: _tcombForked2.default.Function,
  stop: _tcombForked2.default.Function
}, 'SubscribeReturnType');

const logger = new _nightingaleLogger2.default('liwi.websocket-client.query');

class Query extends _AbstractQuery2.default {
  constructor(store, key) {
    _assert(store, _WebsocketStore2.default, 'store');

    _assert(key, _tcombForked2.default.String, 'key');

    super(store);
    this.key = key;
  }

  fetch(callback) {
    _assert(callback, _tcombForked2.default.maybe(_tcombForked2.default.Function), 'callback');

    return _assert(function () {
      return this.store.emit('fetch', this.key).then(callback);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  _subscribe(callback) {
    let _includeInitial = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    let args = _assert(arguments[2], _tcombForked2.default.list(_tcombForked2.default.Any), 'args');

    _assert(callback, _tcombForked2.default.Function, 'callback');

    _assert(args, _tcombForked2.default.list(_tcombForked2.default.Any), 'args');

    return _assert(function () {
      const eventName = `subscribe:${ this.store.restName }.${ this.key }`;
      this.store.connection.on(eventName, (err, result) => {
        callback(err, (0, _msgpack.decode)(result));
      });

      let _stopEmitSubscribe;
      let promise = this.store.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', this.key, eventName, args).then(stopEmitSubscribe => {
        _stopEmitSubscribe = stopEmitSubscribe;
        logger.info('subscribed');
      }).catch(err => {
        this.store.connection.off(eventName, callback);
        throw err;
      });

      const stop = () => {
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
exports.default = Query;

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }

    return type(x);
  }

  if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=Query.js.map