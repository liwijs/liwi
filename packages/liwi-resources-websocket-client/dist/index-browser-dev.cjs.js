'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Logger = _interopDefault(require('nightingale-logger'));
var extendedJson = require('extended-json');
var liwiResourcesClient = require('liwi-resources-client');

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var logger = new Logger('liwi:resources-websocket-client');

var WebsocketClient =
/*#__PURE__*/
function (_AbstractClient) {
  _inheritsLoose(WebsocketClient, _AbstractClient);

  // eslint-disable-next-line typescript/member-ordering
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
      json: extendedJson.encode(value)
    }).then(function (result) {
      return result && extendedJson.decode(result);
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
}(liwiResourcesClient.AbstractClient);

exports.WebsocketClient = WebsocketClient;
//# sourceMappingURL=index-browser-dev.cjs.js.map
