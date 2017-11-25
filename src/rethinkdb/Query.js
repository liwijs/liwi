import AbstractQuery from '../store/AbstractQuery';
import RethinkStore from './RethinkStore';

type SubscribeReturnType = {
  cancel: Function,
  stop: Function,
};

export default class Query extends AbstractQuery<RethinkStore> {
  fetch(callback: ?Function): Promise<any> {
    return this.queryCallback(this.store.query(), this.store.r)
      .run()
      .then(callback);
  }

  _subscribe(callback: Function, _includeInitial = false, args: Array<any>): SubscribeReturnType {
    let _feed;
    let promise = this.queryCallback(this.store.query(), this.store.r)
      .changes({
        includeInitial: _includeInitial,
        includeStates: true,
        includeTypes: true,
        includeOffsets: true,
      })
      .then(feed => {
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
      then: (cb, errCb) => promise.then(cb, errCb),
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
