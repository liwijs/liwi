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
  fetch(callback) {
    _assert(callback, _tcombForked2.default.maybe(_tcombForked2.default.Function), 'callback');

    return _assert(function () {
      return this.queryCallback(this.store.query()).run().then(callback);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  _subscribe(callback) {
    let _includeInitial = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    let args = _assert(arguments[2], _tcombForked2.default.list(_tcombForked2.default.Any), 'args');

    _assert(callback, _tcombForked2.default.Function, 'callback');

    _assert(args, _tcombForked2.default.list(_tcombForked2.default.Any), 'args');

    return _assert(function () {
      let _feed;
      let promise = this.queryCallback(this.store.query()).changes({
        includeInitial: _includeInitial,
        includeStates: true,
        includeTypes: true,
        includeOffsets: true
      }).then(feed => {
        if (args.length === 0) {
          _feed = feed;
          delete this._promise;
        }

        feed.each(callback);
        return feed;
      });

      if (args.length === 0) this._promise = promise;

      const stop = () => {
        this.closeFeed(_feed, promise);
      };

      return {
        stop,
        cancel: stop,
        then: (cb, errCb) => promise.then(cb, errCb)
      };
    }.apply(this, arguments), SubscribeReturnType, 'return value');
  }

  closeFeed(feed, promise) {
    if (feed) {
      feed.close();
    } else if (promise) {
      promise.then(feed => feed.close());
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