import AbstractQuery from '../store/AbstractQuery';

type SubscribeReturnType = {
  cancel: Function,
  stop: Function,
};

export default class Query extends AbstractQuery {
  constructor(store, key: string) {
    super(store);
    this.key = key;
  }

  fetch(callback: ?Function): Promise {
    return this.store.emit('query:fetch', this.key).then(callback);
  }

  subscribe(callback: Function): SubscribeReturnType {
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
