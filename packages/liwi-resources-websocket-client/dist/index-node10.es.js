import Logger from 'nightingale-logger';
import { encode, decode } from 'extended-json';
import { AbstractClient } from 'liwi-resources-client';

const logger = new Logger('liwi:resources-websocket-client');
class WebsocketClient extends AbstractClient {
  // eslint-disable-next-line typescript/member-ordering
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
      json: encode(value)
    }).then(result => result && decode(result));
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
//# sourceMappingURL=index-node10.es.js.map
