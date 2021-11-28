'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Logger = require('nightingale-logger');
var liwiResources = require('liwi-resources');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

var Logger__default = /*#__PURE__*/_interopDefaultLegacy(Logger);

const logger = new Logger__default('liwi:resources:query');
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

exports.ResourcesServerError = liwiResources.ResourcesServerError;
exports.createResourceClientService = createResourceClientService;
//# sourceMappingURL=index-browser-dev.cjs.js.map
