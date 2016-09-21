var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _t from 'tcomb-forked';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import AbstractQuery from '../store/AbstractQuery';

var SubscribeReturnType = _t.interface({
  cancel: _t.Function,
  stop: _t.Function
}, 'SubscribeReturnType');

var Query = function (_AbstractQuery) {
  _inherits(Query, _AbstractQuery);

  function Query(store, key) {
    _assert(key, _t.String, 'key');

    _classCallCheck(this, Query);

    var _this = _possibleConstructorReturn(this, (Query.__proto__ || Object.getPrototypeOf(Query)).call(this, store));

    _this.key = key;
    return _this;
  }

  _createClass(Query, [{
    key: 'fetch',
    value: function fetch(callback) {
      _assert(callback, _t.maybe(_t.Function), 'callback');

      return this.store.emit('query:fetch', this.key).then(callback);
    }
  }, {
    key: 'subscribe',
    value: function subscribe(callback) {
      _assert(callback, _t.Function, 'callback');

      throw new Error('Will be implemented next minor');
      // let subscribeKey;
      var promise = this.store.emit('query:subscribe', this.key).then(function (eventName) {
        // subscribeKey = eventName;
        // this.connection.on(eventName, callback);
      });

      var stop = function stop() {
        if (!promise) return;
        promise.then(function () {
          promise = null;
          // this.store.emit('query:subscribe:stop', subscribeKey);
        });
      };
      var cancel = stop;

      return { cancel: cancel, stop: stop };
    }
  }]);

  return Query;
}(AbstractQuery);

export default Query;

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