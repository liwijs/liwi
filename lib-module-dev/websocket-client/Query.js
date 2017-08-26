var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Logger from 'nightingale-logger';
import AbstractQuery from '../store/AbstractQuery';
import WebsocketStore from './WebsocketStore';
import { decode } from '../extended-json';

import t from 'flow-runtime';
var SubscribeReturnType = t.type('SubscribeReturnType', t.object(t.property('cancel', t.function()), t.property('stop', t.function())));


var logger = new Logger('liwi:websocket-client:query');

var Query = function (_AbstractQuery) {
  _inherits(Query, _AbstractQuery);

  function Query(store, key) {
    _classCallCheck(this, Query);

    var _storeType = t.ref(WebsocketStore);

    var _keyType = t.string();

    t.param('store', _storeType).assert(store);
    t.param('key', _keyType).assert(key);

    var _this = _possibleConstructorReturn(this, (Query.__proto__ || Object.getPrototypeOf(Query)).call(this, store));

    t.bindTypeParameters(_this, t.ref(WebsocketStore));

    _this.key = key;
    return _this;
  }

  _createClass(Query, [{
    key: 'fetch',
    value: function fetch(callback) {
      var _callbackType = t.nullable(t.function());

      var _returnType = t.return(t.any());

      t.param('callback', _callbackType).assert(callback);

      return this.store.emit('fetch', this.key).then(callback).then(function (_arg) {
        return _returnType.assert(_arg);
      });
    }
  }, {
    key: '_subscribe',
    value: function _subscribe(callback) {
      var _this2 = this;

      var _includeInitial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var args = arguments[2];

      var _callbackType2 = t.function();

      var _argsType = t.array(t.any());

      var _returnType2 = t.return(SubscribeReturnType);

      t.param('callback', _callbackType2).assert(callback);
      t.param('args', _argsType).assert(args);

      var eventName = 'subscribe:' + this.store.restName + '.' + this.key;
      var listener = function listener(err, result) {
        var decodedResult = result && decode(result);
        logger.debug(eventName, { result: result, decodedResult: decodedResult });
        callback(err, decodedResult);
      };
      this.store.connection.on(eventName, listener);

      var _stopEmitSubscribe = void 0;
      var promise = this.store.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', this.key, eventName, args).then(function (stopEmitSubscribe) {
        _stopEmitSubscribe = stopEmitSubscribe;
        logger.info('subscribed');
      }).catch(function (err) {
        _this2.store.connection.off(eventName, listener);
        throw err;
      });

      var stop = function stop() {
        if (!promise) return;
        _stopEmitSubscribe();
        promise.then(function () {
          promise = null;
          _this2.store.connection.off(eventName, listener);
        });
      };

      return _returnType2.assert({
        cancel: stop,
        stop: stop,
        then: function then(cb) {
          return Promise.resolve(promise).then(cb);
        }
      });
    }
  }]);

  return Query;
}(AbstractQuery);

export { Query as default };
//# sourceMappingURL=Query.js.map