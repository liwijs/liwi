import AbstractQuery from '../store/AbstractQuery';


export default class Query extends AbstractQuery {
  fetch(callback) {
    return this.queryCallback(this.store.query(), this.store.r).run().then(callback);
  }

  _subscribe(callback, _includeInitial = false, args) {
    var _this = this;

    var _feed = void 0;
    var promise = this.queryCallback(this.store.query(), this.store.r).changes({
      includeInitial: _includeInitial,
      includeStates: true,
      includeTypes: true,
      includeOffsets: true
    }).then(function (feed) {
      if (args.length === 0) {
        _feed = feed;
        delete _this._promise;
      }

      feed.each(callback);
      return feed;
    });

    if (args.length === 0) this._promise = promise;

    var stop = function stop() {
      _this.closeFeed(_feed, promise);
    };

    return {
      stop,
      cancel: stop,
      then: function then(cb, errCb) {
        return promise.then(cb, errCb);
      }
    };
  }

  closeFeed(feed, promise) {
    if (feed) {
      feed.close();
    } else if (promise) {
      promise.then(function (feed) {
        return feed.close();
      });
    }
  }
}
//# sourceMappingURL=Query.js.map