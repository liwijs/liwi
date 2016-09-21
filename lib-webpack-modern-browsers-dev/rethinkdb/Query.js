import _t from 'tcomb-forked';
import AbstractQuery from '../store/AbstractQuery';
import RethinkStore from './RethinkStore';

var SubscribeReturnType = _t.interface({
  cancel: _t.Function,
  stop: _t.Function
}, 'SubscribeReturnType');

export default class Query extends AbstractQuery {
  fetch(callback) {
    _assert(callback, _t.maybe(_t.Function), 'callback');

    return _assert(function () {
      return this.queryCallback(this.store.query()).run().then(callback);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  fetchAndSubscribe(callback) {
    _assert(callback, _t.Function, 'callback');

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return this.subscribe(callback, true, args);
  }

  subscribe(callback) {
    _assert(callback, _t.Function, 'callback');

    throw new Error('Will be implemented next minor');

    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return this.subscribe(callback, false, args);
  }

  _subscribe(callback) {
    var _includeInitial = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var args = arguments[2];

    _assert(callback, _t.Function, 'callback');

    _assert(args, _t.list(_t.Any), 'args');

    return _assert(function () {
      throw new Error('Will be implemented next minor');
      if (args.length === 0 && (!this._subscribers || this._subscribers.length === 0)) {
        if (!this._subscribers) this._subscribers = new Set();
        this._subscribers.add(callback);
      }

      var _feed = undefined;
      var promise = this.queryCallback(this.store.query()).changes({ includeInitial: _includeInitial }).then(feed => {
        if (args.length === 0) {
          _feed = feed;
          this._feed = feed;
          delete this._promise;
        }
        feed.each(callback);
      });

      if (args.length === 0) this._promise = promise;

      var stop = () => {
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