import AbstractQuery from '../store/AbstractQuery';
let Query = class extends AbstractQuery {
  fetch(callback) {
    return this.queryCallback(this.store.query(), this.store.r).run().then(callback);
  }

  _subscribe(callback, _includeInitial = false, args) {
    var _this = this;

    let _feed;
    let promise = this.queryCallback(this.store.query(), this.store.r).changes({
      includeInitial: _includeInitial,
      includeStates: true,
      includeTypes: true,
      includeOffsets: true
    }).then(function (feed) {
      return args.length === 0 && (_feed = feed, delete _this._promise), feed.each(callback), feed;
    });

    args.length === 0 && (this._promise = promise);


    const stop = function stop() {
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
    feed ? feed.close() : promise && promise.then(function (feed) {
      return feed.close();
    });
  }
};
export { Query as default };
//# sourceMappingURL=Query.js.map