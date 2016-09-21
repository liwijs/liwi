'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _AbstractQuery = require('../store/AbstractQuery');

var _AbstractQuery2 = _interopRequireDefault(_AbstractQuery);

var _RethinkStore = require('./RethinkStore');

var _RethinkStore2 = _interopRequireDefault(_RethinkStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SubscribeReturnType = _tcombForked2.default.interface({
  cancel: _tcombForked2.default.Function,
  stop: _tcombForked2.default.Function
}, 'SubscribeReturnType');

class Query extends _AbstractQuery2.default {
  fetch(callback) {
    _assert(callback, _tcombForked2.default.maybe(_tcombForked2.default.Function), 'callback');

    return _assert(function () {
      return this.queryCallback(this.store.query()).run().then(callback);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  fetchAndSubscribe(callback) {
    _assert(callback, _tcombForked2.default.Function, 'callback');

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return this.subscribe(callback, true, args);
  }

  subscribe(callback) {
    _assert(callback, _tcombForked2.default.Function, 'callback');

    throw new Error('Will be implemented next minor');

    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return this.subscribe(callback, false, args);
  }

  _subscribe(callback) {
    let _includeInitial = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    let args = _assert(arguments[2], _tcombForked2.default.list(_tcombForked2.default.Any), 'args');

    _assert(callback, _tcombForked2.default.Function, 'callback');

    _assert(args, _tcombForked2.default.list(_tcombForked2.default.Any), 'args');

    return _assert(function () {
      throw new Error('Will be implemented next minor');
      if (args.length === 0 && (!this._subscribers || this._subscribers.length === 0)) {
        if (!this._subscribers) this._subscribers = new Set();
        this._subscribers.add(callback);
      }

      let _feed;
      let promise = this.queryCallback(this.store.query()).changes({ includeInitial: _includeInitial }).then(feed => {
        if (args.length === 0) {
          _feed = feed;
          this._feed = feed;
          delete this._promise;
        }
        feed.each(callback);
      });

      if (args.length === 0) this._promise = promise;

      const stop = () => {
        if (args.length === 0) {
          this._subscribers.remove(callback);
          this._checkFeedClose();
        } else {
          this.closeFeed(_feed, promise);
        }
      };

      return { stop, cancel: stop };
    }.apply(this, arguments), SubscribeReturnType, 'return value');
  }

  _checkFeedClose() {
    if (!this._subscribers || this._subscribers.length === 0) {
      this.closeFeed(this._feed, this._promise);
    }
  }

  closeFeed(feed, promise) {
    if (feed) {
      feed.close();
    } else if (promise) {
      promise.then(() => feed.close());
    }
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