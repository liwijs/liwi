import AbstractQuery from '../store/AbstractQuery';
import RethinkStore from './RethinkStore';

import t from 'flow-runtime';
const SubscribeReturnType = t.type('SubscribeReturnType', t.object(t.property('cancel', t.function()), t.property('stop', t.function())));
let Query = class extends AbstractQuery {
  constructor(...args) {
    super(...args);
    t.bindTypeParameters(this, t.ref(RethinkStore));
  }

  fetch(callback) {
    let _callbackType = t.nullable(t.function());

    const _returnType = t.return(t.any());

    t.param('callback', _callbackType).assert(callback);

    return this.queryCallback(this.store.query(), this.store.r).run().then(callback).then(_arg => _returnType.assert(_arg));
  }

  _subscribe(callback, _includeInitial = false, args) {
    let _callbackType2 = t.function();

    let _argsType = t.array(t.any());

    const _returnType2 = t.return(SubscribeReturnType);

    t.param('callback', _callbackType2).assert(callback);
    t.param('args', _argsType).assert(args);

    let _feed;
    let promise = this.queryCallback(this.store.query(), this.store.r).changes({
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

    return _returnType2.assert({
      stop,
      cancel: stop,
      then: (cb, errCb) => promise.then(cb, errCb)
    });
  }

  closeFeed(feed, promise) {
    if (feed) {
      feed.close();
    } else if (promise) {
      promise.then(feed => feed.close());
    }
  }
};
export { Query as default };
//# sourceMappingURL=Query.js.map