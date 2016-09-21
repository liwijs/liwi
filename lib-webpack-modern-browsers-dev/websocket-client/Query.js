import _t from 'tcomb-forked';
import AbstractQuery from '../store/AbstractQuery';

var SubscribeReturnType = _t.interface({
  cancel: _t.Function,
  stop: _t.Function
}, 'SubscribeReturnType');

export default class Query extends AbstractQuery {
  constructor(store, key) {
    _assert(key, _t.String, 'key');

    super(store);
    this.key = key;
  }

  fetch(callback) {
    _assert(callback, _t.maybe(_t.Function), 'callback');

    return _assert(function () {
      return this.store.emit('query:fetch', this.key).then(callback);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  subscribe(callback) {
    _assert(callback, _t.Function, 'callback');

    return _assert(function () {
      throw new Error('Will be implemented next minor');
      // let subscribeKey;
      var promise = this.store.emit('query:subscribe', this.key).then(eventName => {
        // subscribeKey = eventName;
        // this.connection.on(eventName, callback);
      });

      var stop = () => {
        if (!promise) return;
        promise.then(() => {
          promise = null;
          // this.store.emit('query:subscribe:stop', subscribeKey);
        });
      };
      var cancel = stop;

      return { cancel, stop };
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