import AbstractQuery from '../store/AbstractQuery';

export default class Query extends AbstractQuery {
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
    var promise = this.store.emit('query:subscribe', this.key).then(eventName => {
      // subscribeKey = eventName;
      // this.connection.on(eventName, callback);
    });

    var stop = () => {
      if (!promise) return;
      promise.then(() => {
        promise = null;
        // this.store.emit('query:subscribe:stop', subscribeKey);
      });
    };
    var cancel = stop;

    return { cancel, stop };
  }
}
//# sourceMappingURL=Query.js.map