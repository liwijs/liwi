var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _possibleConstructorReturn(self, call) { if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass); }

import Logger from 'nightingale-logger';
import AbstractQuery from '../store/AbstractQuery';

import { decode } from '../extended-json';

var logger = new Logger('liwi:websocket-client:query');

var Query = function (_AbstractQuery) {
  function Query(store, key) {
    _classCallCheck(this, Query);

    var _this = _possibleConstructorReturn(this, (Query.__proto__ || Object.getPrototypeOf(Query)).call(this, store));

    return _this.key = key, _this.key = key, _this;
  }

  return _inherits(Query, _AbstractQuery), _createClass(Query, [{
    key: 'fetch',
    value: function fetch(callback) {
      return this.store.emit('fetch', this.key).then(callback);
    }
  }, {
    key: '_subscribe',
    value: function _subscribe(callback) {
      var _this2 = this;

      var _includeInitial = arguments.length > 1 && arguments[1] !== void 0 && arguments[1];

      var args = arguments[2];

      var eventName = 'subscribe:' + this.store.restName + '.' + this.key;
      var listener = function listener(err, result) {
        var decodedResult = result && decode(result);
        false, callback(err, decodedResult);
      };
      this.store.connection.on(eventName, listener);


      var _stopEmitSubscribe = void 0;
      var promise = this.store.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', this.key, eventName, args).then(function (stopEmitSubscribe) {
        _stopEmitSubscribe = stopEmitSubscribe, logger.info('subscribed');
      }).catch(function (err) {
        throw _this2.store.connection.off(eventName, listener), err;
      });

      var stop = function stop() {
        promise && (_stopEmitSubscribe(), promise.then(function () {
          promise = null, _this2.store.connection.off(eventName, listener);
        }));
      };

      return {
        cancel: stop,
        stop: stop,
        then: function then(cb) {
          return Promise.resolve(promise).then(cb);
        }
      };
    }
  }]), Query;
}(AbstractQuery);

export { Query as default };
//# sourceMappingURL=Query.js.map