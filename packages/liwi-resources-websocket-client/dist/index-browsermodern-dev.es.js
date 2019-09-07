import Logger from 'nightingale-logger';
import { encode, decode } from 'extended-json';
import { AbstractClient } from 'liwi-resources-client';

/* eslint-disable max-classes-per-file */
const logger = new Logger('liwi:resources-websocket-client');
class WebsocketClient extends AbstractClient {
  constructor(websocket, resourceName, keyPath) {
    super(resourceName, keyPath);
    this.websocket = websocket;
    this.resourceName = resourceName;
  }

  emitSubscribe(type, args) {
    var _this = this;

    const websocket = this.websocket;

    const emit = function emit() {
      return _this.send(type, args);
    };

    const registerOnConnect = function registerOnConnect() {
      websocket.on('connect', emit);
      return function () {
        websocket.off('connect', emit);
      };
    };

    if (websocket.isConnected()) {
      return emit().then(registerOnConnect);
    }

    return Promise.resolve(registerOnConnect());
  }

  createCursor(options) {
    return this.websocket.emit('createCursor', options);
  }

  send(type, value) {
    logger.debug('emit', {
      type,
      value
    });

    if (this.websocket.isDisconnected()) {
      throw new Error('Websocket is not connected');
    }

    if (!this.resourceName) {
      throw new Error('Invalid resourceName');
    }

    return this.websocket.emit('resource', {
      type,
      resourceName: this.resourceName,
      json: encode(value)
    }).then(function (result) {
      return result && decode(result);
    });
  }

  on(event, handler) {
    this.websocket.on(event, handler);
    return handler;
  }

  off(event, handler) {
    this.websocket.off(event, handler);
  }

}
function createMongoResourcesWebsocketClient(websocket) {
  return class WebsocketResourcesClient extends WebsocketClient {
    constructor(resourceName) {
      super(websocket, resourceName, '_id');
    }

  };
}

export { WebsocketClient, createMongoResourcesWebsocketClient };
//# sourceMappingURL=index-browsermodern-dev.es.js.map
