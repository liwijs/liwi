import _t from 'tcomb-forked';
import AbstractQuery from '../store/AbstractQuery';

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

  _subscribe(callback) {
    var _includeInitial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var args = arguments[2];

    _assert(callback, _t.Function, 'callback');

    _assert(args, _t.list(_t.Any), 'args');

    return _assert(function () {
      var _feed = void 0;
      var promise = this.queryCallback(this.store.query()).changes({
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

      var stop = () => {
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

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=Query.js.map