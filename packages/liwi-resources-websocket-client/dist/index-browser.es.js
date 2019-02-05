import Logger from 'nightingale-logger';
import { encode, decode } from 'extended-json';
import { AbstractClient } from 'liwi-resources-client';

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

  _proto.emitSubscribe = function emitSubscribe(type) {
    var _this2 = this,
        _len,
        args,
        _key;

    for (_len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var websocket = this.websocket;

    var emit = function emit() {
      return _this2.send.apply(_this2, [type].concat(args));
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

  _proto.send = function send(type) {
    var _len2, args, _key2;

    for (_len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    logger.debug('emit', {
      type: type,
      args: args
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
      json: encode(args)
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

export { WebsocketClient };
//# sourceMappingURL=index-browser.es.js.map
