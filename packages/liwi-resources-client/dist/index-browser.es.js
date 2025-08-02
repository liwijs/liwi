export { ResourcesServerError } from 'liwi-resources';
import { Logger } from 'nightingale-logger';

const logger = new Logger("liwi:resources:query");
class ClientQuery {
  // eslint-disable-next-line @typescript-eslint/max-params
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
    this.params = {
      ...this.params,
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
    logger.debug("fetch", {
      resourceName: this.resourceName,
      key: this.key
    });
    return this.transportClient.send("fetch", this.getTransportPayload()).then(onFulfilled);
  }
  fetchAndSubscribe(callback) {
    logger.debug("fetchAndSubscribe", {
      resourceName: this.resourceName,
      key: this.key
    });
    return this.transportClient.subscribe("fetchAndSubscribe", this.getTransportPayload(), callback);
  }
  subscribe(callback) {
    logger.debug("subscribe", {
      resourceName: this.resourceName,
      key: this.key
    });
    return this.transportClient.subscribe("subscribe", this.getTransportPayload(), callback);
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
      operations[operationKey] = params => transportClient.send("do", {
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

export { createResourceClientService };
//# sourceMappingURL=index-browser.es.js.map
