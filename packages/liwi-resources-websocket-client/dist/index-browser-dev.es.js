import _inheritsLoose from '@babel/runtime/helpers/esm/inheritsLoose';
import Logger from 'nightingale-logger';
import { encode, decode } from 'extended-json';
import { AbstractClient } from 'liwi-resources-client';

var logger = new Logger('liwi:resources-websocket-client');

var WebsocketClient =
/*#__PURE__*/
function (_AbstractClient) {
  _inheritsLoose(WebsocketClient, _AbstractClient);

  function WebsocketClient(websocket, resourceName, keyPath) {
    var _this = _AbstractClient.call(this, resourceName, keyPath) || this;

    _this.websocket = websocket;
    _this.resourceName = resourceName;
    return _this;
  }

  var _proto = WebsocketClient.prototype;

  _proto.emitSubscribe = function emitSubscribe(type, args) {
    var _this2 = this;

    var websocket = this.websocket;

    var emit = function emit() {
      return _this2.send(type, args);
    };

    var registerOnConnect = function registerOnConnect() {
      websocket.on('connect', emit);
      return function () {
        websocket.off('connect', emit);
      };
    };

    if (websocket.isConnected()) {
      return emit().then(registerOnConnect);
    }

    return Promise.resolve(registerOnConnect());
  };

  _proto.createCursor = function createCursor(options) {
    return this.websocket.emit('createCursor', options);
  };

  _proto.send = function send(type, value) {
    logger.debug('emit', {
      type: type,
      value: value
    });

    if (this.websocket.isDisconnected()) {
      throw new Error('Websocket is not connected');
    }

    if (!this.resourceName) {
      throw new Error('Invalid resourceName');
    }

    return this.websocket.emit('resource', {
      type: type,
      resourceName: this.resourceName,
      json: encode(value)
    }).then(function (result) {
      return result && decode(result);
    });
  };

  _proto.on = function on(event, handler) {
    this.websocket.on(event, handler);
    return handler;
  };

  _proto.off = function off(event, handler) {
    this.websocket.off(event, handler);
  };

  return WebsocketClient;
}(AbstractClient);
function createMongoResourcesWebsocketClient(websocket) {
  return (
    /*#__PURE__*/
    function (_WebsocketClient) {
      _inheritsLoose(WebsocketResourcesClient, _WebsocketClient);

      function WebsocketResourcesClient(resourceName) {
        return _WebsocketClient.call(this, websocket, resourceName, '_id') || this;
      }

      return WebsocketResourcesClient;
    }(WebsocketClient)
  );
}

export { WebsocketClient, createMongoResourcesWebsocketClient };
//# sourceMappingURL=index-browser-dev.es.js.map
