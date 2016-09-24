import AbstractQuery from '../store/AbstractQuery';
import RethinkStore from './RethinkStore';

export default class Query extends AbstractQuery {
  fetch(callback) {
    return this.queryCallback(this.store.query()).run().then(callback);
  }

  _subscribe(callback) {
    var _includeInitial = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var args = arguments[2];

    var _feed = undefined;
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
  }

  closeFeed(feed, promise) {
    if (feed) {
      feed.close();
    } else if (promise) {
      promise.then(feed => feed.close());
    }
  }
}
//# sourceMappingURL=Query.js.map