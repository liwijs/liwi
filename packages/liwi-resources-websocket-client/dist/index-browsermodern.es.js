import Logger from 'nightingale-logger';
import { encode, decode } from 'extended-json';
import { AbstractClient } from 'liwi-resources';

const logger = new Logger('liwi:resources-websocket-client');
class WebsocketClient extends AbstractClient {
  // eslint-disable-next-line typescript/member-ordering
  constructor(websocket, resourceName, keyPath) {
    super(resourceName, keyPath);
    this.websocket = websocket;
    this.resourceName = resourceName;
  }

  emitSubscribe(type, ...args) {
    var _this = this;

    const websocket = this.websocket;

    const emit = function emit() {
      return _this.send(type, ...args);
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

  send(type, ...args) {
    logger.debug('emit', {
      type,
      args
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
      json: encode(args)
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

export { WebsocketClient };
//# sourceMappingURL=index-browsermodern.es.js.map
