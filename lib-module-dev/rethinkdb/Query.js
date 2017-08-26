var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import AbstractQuery from '../store/AbstractQuery';
import RethinkStore from './RethinkStore';

import t from 'flow-runtime';
var SubscribeReturnType = t.type('SubscribeReturnType', t.object(t.property('cancel', t.function()), t.property('stop', t.function())));

var Query = function (_AbstractQuery) {
  _inherits(Query, _AbstractQuery);

  function Query() {
    var _ref;

    _classCallCheck(this, Query);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = Query.__proto__ || Object.getPrototypeOf(Query)).call.apply(_ref, [this].concat(args)));

    t.bindTypeParameters(_this, t.ref(RethinkStore));
    return _this;
  }

  _createClass(Query, [{
    key: 'fetch',
    value: function fetch(callback) {
      var _callbackType = t.nullable(t.function());

      var _returnType = t.return(t.any());

      t.param('callback', _callbackType).assert(callback);

      return this.queryCallback(this.store.query(), this.store.r).run().then(callback).then(function (_arg) {
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

      var _feed = void 0;
      var promise = this.queryCallback(this.store.query(), this.store.r).changes({
        includeInitial: _includeInitial,
        includeStates: true,
        includeTypes: true,
        includeOffsets: true
      }).then(function (feed) {
        if (args.length === 0) {
          _feed = feed;
          delete _this2._promise;
        }

        feed.each(callback);
        return feed;
      });

      if (args.length === 0) this._promise = promise;

      var stop = function stop() {
        _this2.closeFeed(_feed, promise);
      };

      return _returnType2.assert({
        stop: stop,
        cancel: stop,
        then: function then(cb, errCb) {
          return promise.then(cb, errCb);
        }
      });
    }
  }, {
    key: 'closeFeed',
    value: function closeFeed(feed, promise) {
      if (feed) {
        feed.close();
      } else if (promise) {
        promise.then(function (feed) {
          return feed.close();
        });
      }
    }
  }]);

  return Query;
}(AbstractQuery);

export { Query as default };
//# sourceMappingURL=Query.js.map