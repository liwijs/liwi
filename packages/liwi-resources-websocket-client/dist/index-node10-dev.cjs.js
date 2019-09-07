'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const Logger = _interopDefault(require('nightingale-logger'));
const extendedJson = require('extended-json');
const liwiResourcesClient = require('liwi-resources-client');

/* eslint-disable max-classes-per-file */
const logger = new Logger('liwi:resources-websocket-client');
class WebsocketClient extends liwiResourcesClient.AbstractClient {
  constructor(websocket, resourceName, keyPath) {
    super(resourceName, keyPath);
    this.websocket = websocket;
    this.resourceName = resourceName;
  }

  emitSubscribe(type, args) {
    const websocket = this.websocket;

    const emit = () => this.send(type, args);

    const registerOnConnect = () => {
      websocket.on('connect', emit);
      return () => {
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
      json: extendedJson.encode(value)
    }).then(result => result && extendedJson.decode(result));
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

exports.WebsocketClient = WebsocketClient;
exports.createMongoResourcesWebsocketClient = createMongoResourcesWebsocketClient;
//# sourceMappingURL=index-node10-dev.cjs.js.map
