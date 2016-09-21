'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AbstractQuery = require('../store/AbstractQuery');

var _AbstractQuery2 = _interopRequireDefault(_AbstractQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Query extends _AbstractQuery2.default {
  constructor(store, key) {
    super(store);
    this.key = key;
  }

  fetch(callback) {
    return this.store.emit('query:fetch', this.key).then(callback);
  }

  subscribe(callback) {
    throw new Error('Will be implemented next minor');
    // let subscribeKey;
    let promise = this.store.emit('query:subscribe', this.key).then(eventName => {
      // subscribeKey = eventName;
      // this.connection.on(eventName, callback);
    });

    const stop = () => {
      if (!promise) return;
      promise.then(() => {
        promise = null;
        // this.store.emit('query:subscribe:stop', subscribeKey);
      });
    };
    const cancel = stop;

    return { cancel, stop };
  }
}
exports.default = Query;
//# sourceMappingURL=Query.js.map