import Logger from 'nightingale-logger';
import { decode } from 'extended-json';
import { AbstractQuery } from 'liwi-store';

const logger = new Logger('liwi:resources:query');
class ClientQuery extends AbstractQuery {
  constructor(client, key, params) {
    super();
    this.client = client;
    this.key = key;
    this.params = params;
  }

  fetch(onFulfilled) {
    return this.client.send('fetch', [this.key, this.params, undefined]).then(onFulfilled);
  }

  _subscribe(callback, _includeInitial = false) {
    var _this = this;

    const eventName = `subscribe:${this.client.resourceName}.${this.key}`;

    const listener = function listener(err, result) {
      const decodedResult = result && decode(result);
      callback(err, decodedResult);
    };

    this.client.on(eventName, listener);

    let _stopEmitSubscribeOnConnect;

    let promise = this.client.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', [this.key, this.params, eventName]).then(function (stopEmitSubscribe) {
      _stopEmitSubscribeOnConnect = stopEmitSubscribe;
      logger.info('subscribed', {
        resourceName: _this.client.resourceName,
        key: _this.key
      });
    }, function (err) {
      _this.client.off(eventName, listener);

      throw err;
    });

    const stop = function stop() {
      if (!promise) return;
      promise.then(function () {
        logger.info('unsubscribe', {
          resourceName: _this.client.resourceName,
          key: _this.key
        });

        _stopEmitSubscribeOnConnect();

        _this.client.send('unsubscribe', [_this.key]);

        promise = undefined;

        _this.client.off(eventName, listener);
      });
    };

    return {
      cancel: stop,
      stop,
      then: function then(cb) {
        return Promise.resolve(promise).then(cb);
      }
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

  createQuery(key, params) {
    return new ClientQuery(this, key, params);
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

const createResourceClientService = function createResourceClientService(client, options) {
  const queries = {};
  const operations = {};
  options.queries.forEach(function (queryKey) {
    queries[queryKey] = function (params) {
      return client.createQuery(queryKey, params);
    };
  });
  options.operations.forEach(function (operationKey) {
    operations[operationKey] = function (params) {
      return client.send('do', [operationKey, params]);
    };
  });
  return {
    queries: queries,
    operations: operations
  };
};
/** @deprecated use createResourceClientService instead */

const createResourceClient = createResourceClientService;

export { createResourceClientService, createResourceClient, AbstractClient };
//# sourceMappingURL=index-browsermodern.es.js.map
