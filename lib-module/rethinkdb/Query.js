var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _possibleConstructorReturn(self, call) { if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass); }

import AbstractQuery from '../store/AbstractQuery';

var Query = function (_AbstractQuery) {
  function Query() {
    return _classCallCheck(this, Query), _possibleConstructorReturn(this, (Query.__proto__ || Object.getPrototypeOf(Query)).apply(this, arguments));
  }

  return _inherits(Query, _AbstractQuery), _createClass(Query, [{
    key: 'fetch',
    value: function fetch(callback) {
      return this.queryCallback(this.store.query(), this.store.r).run().then(callback);
    }
  }, {
    key: '_subscribe',
    value: function _subscribe(callback) {
      var _this2 = this;

      var _includeInitial = arguments.length > 1 && arguments[1] !== void 0 && arguments[1];

      var args = arguments[2];

      var _feed = void 0;
      var promise = this.queryCallback(this.store.query(), this.store.r).changes({
        includeInitial: _includeInitial,
        includeStates: true,
        includeTypes: true,
        includeOffsets: true
      }).then(function (feed) {
        return args.length === 0 && (_feed = feed, delete _this2._promise), feed.each(callback), feed;
      });

      args.length === 0 && (this._promise = promise);


      var stop = function stop() {
        _this2.closeFeed(_feed, promise);
      };

      return {
        stop: stop,
        cancel: stop,
        then: function then(cb, errCb) {
          return promise.then(cb, errCb);
        }
      };
    }
  }, {
    key: 'closeFeed',
    value: function closeFeed(feed, promise) {
      feed ? feed.close() : promise && promise.then(function (feed) {
        return feed.close();
      });
    }
  }]), Query;
}(AbstractQuery);

export { Query as default };
//# sourceMappingURL=Query.js.map