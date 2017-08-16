'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractQuery = require('../store/AbstractQuery');

var _AbstractQuery2 = _interopRequireDefault(_AbstractQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let Query = class extends _AbstractQuery2.default {
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
exports.default = Query;
//# sourceMappingURL=Query.js.map