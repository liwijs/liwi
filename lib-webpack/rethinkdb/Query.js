var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import AbstractQuery from '../store/AbstractQuery';
import RethinkStore from './RethinkStore';

var Query = function (_AbstractQuery) {
  _inherits(Query, _AbstractQuery);

  function Query() {
    _classCallCheck(this, Query);

    return _possibleConstructorReturn(this, (Query.__proto__ || Object.getPrototypeOf(Query)).apply(this, arguments));
  }

  _createClass(Query, [{
    key: 'fetch',
    value: function fetch(callback) {
      return this.queryCallback(this.store.query()).run().then(callback);
    }
  }, {
    key: '_subscribe',
    value: function _subscribe(callback) {
      var _this2 = this;

      var _includeInitial = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var args = arguments[2];

      var _feed = undefined;
      var promise = this.queryCallback(this.store.query()).changes({
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

export default Query;
//# sourceMappingURL=Query.js.map