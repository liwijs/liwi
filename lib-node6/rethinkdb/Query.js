'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AbstractQuery = require('../store/AbstractQuery');

var _AbstractQuery2 = _interopRequireDefault(_AbstractQuery);

var _RethinkStore = require('./RethinkStore');

var _RethinkStore2 = _interopRequireDefault(_RethinkStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Query extends _AbstractQuery2.default {
  fetch(callback) {
    return this.queryCallback(this.store.query()).run().then(callback);
  }

  fetchAndSubscribe(callback) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return this.subscribe(callback, true, args);
  }

  subscribe(callback) {
    throw new Error('Will be implemented next minor');

    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return this.subscribe(callback, false, args);
  }

  _subscribe(callback) {
    let _includeInitial = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    let args = arguments[2];

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
//# sourceMappingURL=Query.js.map