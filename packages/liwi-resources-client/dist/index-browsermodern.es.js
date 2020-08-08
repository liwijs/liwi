import Logger from 'nightingale-logger';
export { ResourcesServerError } from 'liwi-resources';

const logger = new Logger('liwi:resources:query');
class ClientQuery {
  constructor(resourceName, transportClient, key, params) {
    this.resourceName = resourceName;
    this.transportClient = transportClient;
    this.key = key;
    this.params = params;
  }

  changeParams(params) {
    this.params = params;
  }

  changePartialParams(params) {
    this.params = Object.assign({}, this.params, params);
  }

  getTransportPayload() {
    return {
      resourceName: this.resourceName,
      key: this.key,
      params: this.params
    };
  }

  fetch(onFulfilled) {
    logger.debug('fetch', {
      resourceName: this.resourceName,
      key: this.key
    });
    return this.transportClient.send('fetch', this.getTransportPayload()).then(onFulfilled);
  }

  fetchAndSubscribe(callback) {
    logger.debug('fetchAndSubscribe', {
      resourceName: this.resourceName,
      key: this.key
    });
    return this.transportClient.subscribe('fetchAndSubscribe', this.getTransportPayload(), callback);
  }

  subscribe(callback) {
    logger.debug('subscribe', {
      resourceName: this.resourceName,
      key: this.key
    });
    return this.transportClient.subscribe('subscribe', this.getTransportPayload(), callback);
  }

}

const getKeys = function getKeys(o) {
  return Object.keys(o);
};

const createResourceClientService = function createResourceClientService(resourceName, options) {
  return function (transportClient) {
    const queries = {};
    const operations = {};
    getKeys(options.queries).forEach(function (queryKey) {
      queries[queryKey] = function (params) {
        return new ClientQuery(resourceName, transportClient, queryKey, params);
      };
    });
    getKeys(options.operations).forEach(function (operationKey) {
      operations[operationKey] = function (params) {
        return transportClient.send('do', {
          resourceName,
          operationKey: operationKey,
          params
        });
      };
    });
    return {
      queries,
      operations
    };
  };
};

export { createResourceClientService };
//# sourceMappingURL=index-browsermodern.es.js.map
