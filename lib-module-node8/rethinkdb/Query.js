import AbstractQuery from '../store/AbstractQuery';
let Query = class extends AbstractQuery {
  fetch(callback) {
    return this.queryCallback(this.store.query(), this.store.r).run().then(callback);
  }

  _subscribe(callback, _includeInitial = false, args) {
    let _feed;
    let promise = this.queryCallback(this.store.query(), this.store.r).changes({
      includeInitial: _includeInitial,
      includeStates: true,
      includeTypes: true,
      includeOffsets: true
    }).then(feed => (args.length === 0 && (_feed = feed, delete this._promise), feed.each(callback), feed));

    args.length === 0 && (this._promise = promise);


    const stop = () => {
      this.closeFeed(_feed, promise);
    };

    return {
      stop,
      cancel: stop,
      then: (cb, errCb) => promise.then(cb, errCb)
    };
  }

  closeFeed(feed, promise) {
    feed ? feed.close() : promise && promise.then(feed => feed.close());
  }
};
export { Query as default };
//# sourceMappingURL=Query.js.map