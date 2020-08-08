'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const Logger = _interopDefault(require('nightingale-logger'));
const liwiResources = require('liwi-resources');

const logger = new Logger('liwi:resources:query');
class ClientQuery {
  constructor(resourceName, transportClient, key, params) {
    this.resourceName = resourceName;
    this.transportClient = transportClient;
    this.key = key;
    this.params = params;
  }

  changePartialParams(params) {
    this.params = { ...this.params,
      ...params
    };
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

const getKeys = o => Object.keys(o);

const createResourceClientService = (resourceName, options) => {
  return transportClient => {
    const queries = {};
    const operations = {};
    getKeys(options.queries).forEach(queryKey => {
      queries[queryKey] = params => new ClientQuery(resourceName, transportClient, queryKey, params);
    });
    getKeys(options.operations).forEach(operationKey => {
      operations[operationKey] = params => transportClient.send('do', {
        resourceName,
        operationKey: operationKey,
        params
      });
    });
    return {
      queries,
      operations
    };
  };
};

Object.defineProperty(exports, 'ResourcesServerError', {
  enumerable: true,
  get: function () {
    return liwiResources.ResourcesServerError;
  }
});
exports.createResourceClientService = createResourceClientService;
//# sourceMappingURL=index-node10.cjs.js.map
