import AbstractQuery from '../store/AbstractQuery';
import RethinkStore from './RethinkStore';

type SubscribeReturnType = {
  cancel: Function,
  stop: Function,
};

export default class Query extends AbstractQuery<RethinkStore> {
  fetch(callback: ?Function): Promise {
    return this.queryCallback(this.store.query()).run().then(callback);
  }

  fetchAndSubscribe(callback: Function, ...args) {
    return this.subscribe(callback, true, args);
  }

  subscribe(callback: Function, ...args) {
    throw new Error('Will be implemented next minor');
    return this.subscribe(callback, false, args);
  }

  _subscribe(callback: Function, _includeInitial = false, args: Array<any>): SubscribeReturnType {
    throw new Error('Will be implemented next minor');
    if (args.length === 0 && (!this._subscribers || this._subscribers.length === 0)) {
      if (!this._subscribers) this._subscribers = new Set();
      this._subscribers.add(callback);
    }

    let _feed;
    let promise =
      this.queryCallback(this.store.query()).changes({ includeInitial: _includeInitial })
      .then(feed => {
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
