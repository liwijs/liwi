'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _AbstractQuery = require('../store/AbstractQuery');

var _AbstractQuery2 = _interopRequireDefault(_AbstractQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SubscribeReturnType = _tcombForked2.default.interface({
  cancel: _tcombForked2.default.Function,
  stop: _tcombForked2.default.Function
}, 'SubscribeReturnType');

class Query extends _AbstractQuery2.default {
  constructor(store, key) {
    _assert(key, _tcombForked2.default.String, 'key');

    super(store);
    this.key = key;
  }

  fetch(callback) {
    _assert(callback, _tcombForked2.default.maybe(_tcombForked2.default.Function), 'callback');

    return _assert(function () {
      return this.store.emit('query:fetch', this.key).then(callback);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  subscribe(callback) {
    _assert(callback, _tcombForked2.default.Function, 'callback');

    return _assert(function () {
      throw new Error('Will be implemented next minor');
      // let subscribeKey;
      let promise = this.store.emit('query:subscribe', this.key).then(eventName => {
        // subscribeKey = eventName;
        // this.connection.on(eventName, callback);
      });

      const stop = () => {
        if (!promise) return;
        promise.then(() => {
          promise = null;
          // this.store.emit('query:subscribe:stop', subscribeKey);
        });
      };
      const cancel = stop;

      return { cancel, stop };
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