var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _t from 'tcomb-forked';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Logger from 'nightingale-logger';
import AbstractQuery from '../store/AbstractQuery';
import WebsocketStore from './WebsocketStore';
import { decode } from '../msgpack';

var SubscribeReturnType = _t.interface({
  cancel: _t.Function,
  stop: _t.Function
}, 'SubscribeReturnType');

var logger = new Logger('liwi.websocket-client.query');

var Query = function (_AbstractQuery) {
  _inherits(Query, _AbstractQuery);

  function Query(store, key) {
    _assert(store, WebsocketStore, 'store');

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

      return this.store.emit('fetch', this.key).then(callback);
    }
  }, {
    key: '_subscribe',
    value: function _subscribe(callback) {
      var _this2 = this;

      var _includeInitial = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var args = arguments[2];

      _assert(callback, _t.Function, 'callback');

      _assert(args, _t.list(_t.Any), 'args');

      var eventName = 'subscribe:' + this.store.restName + '.' + this.key;
      this.store.connection.on(eventName, function (err, result) {
        callback(err, decode(result));
      });

      var _stopEmitSubscribe = undefined;
      var promise = this.store.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', this.key, eventName, args).then(function (stopEmitSubscribe) {
        _stopEmitSubscribe = stopEmitSubscribe;
        logger.info('subscribed');
      }).catch(function (err) {
        _this2.store.connection.off(eventName, callback);
        throw err;
      });

      var stop = function stop() {
        if (!promise) return;
        _stopEmitSubscribe();
        promise.then(function () {
          promise = null;
          _this2.store.connection.off(eventName, callback);
        });
      };

      return {
        cancel: stop,
        stop: stop,
        then: function then(cb) {
          return Promise.resolve(promise).then(cb);
        }
      };
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