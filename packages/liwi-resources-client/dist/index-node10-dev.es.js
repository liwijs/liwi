import Logger from 'nightingale-logger';
import { decode } from 'extended-json';
import { AbstractQuery } from 'liwi-store';

const logger = new Logger('liwi:resources:query');
class Query extends AbstractQuery {
  constructor(client, key) {
    super();
    this.client = client;
    this.key = key;
  }

  fetch(onFulfilled) {
    return this.client.send('fetch', this.key).then(onFulfilled);
  }

  _subscribe(callback, _includeInitial = false, args) {
    const eventName = `subscribe:${this.client.resourceName}.${this.key}`;

    const listener = (err, result) => {
      const decodedResult = result && decode(result);
      logger.debug(eventName, {
        result,
        decodedResult
      });
      callback(err, decodedResult);
    };

    this.client.on(eventName, listener);

    let _stopEmitSubscribe;

    let promise = this.client.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', [this.key, eventName, args]).then(stopEmitSubscribe => {
      _stopEmitSubscribe = stopEmitSubscribe;
      logger.info('subscribed');
    }).catch(err => {
      this.client.off(eventName, listener);
      throw err;
    });

    const stop = () => {
      if (!promise) return;

      _stopEmitSubscribe();

      promise.then(() => {
        promise = undefined;
        this.client.off(eventName, listener);
      });
    };

    return {
      cancel: stop,
      stop,
      then: cb => Promise.resolve(promise).then(cb)
    };
  }

}

class AbstractClient {
  constructor(resourceName, keyPath) {
    this.resourceName = resourceName;

    if (!resourceName) {
      throw new Error(`Invalid resourceName: "${resourceName}"`);
    }

    this.keyPath = keyPath;
  }

  createQuery(key) {
    return new Query(this, key);
  }

  // cursor(
  //   criteria?: Criteria<Model>,
  //   sort?: Sort<Model>,
  // ): Promise<ClientCursor<Model, KeyPath>> {
  //   return Promise.resolve(new ClientCursor(this, { criteria, sort }));
  // }
  findByKey() {
    throw new Error('Use operations instead');
  }

  replaceOne() {
    throw new Error('Use operations instead');
  }

  partialUpdateByKey() {
    throw new Error('Use operations instead');
  }

  deleteByKey() {
    throw new Error('Use operations instead');
  }

}

const createResourceClient = (client, options) => ({
  queries: options.queries.map(queryKey => client.createQuery(queryKey)),
  operations: options.operations.map(operationKey => params => client.send('do', [operationKey, params]))
});

export { createResourceClient, AbstractClient };
//# sourceMappingURL=index-node10-dev.es.js.map
