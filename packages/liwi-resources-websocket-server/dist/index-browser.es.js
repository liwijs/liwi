import { decode, encode } from 'extended-json';
import { createMessageHandler, ResourcesServerError } from 'liwi-resources-server';
import { Logger } from 'nightingale-logger';
import { WebSocketServer } from 'ws';

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"], i; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { var i, arr2; if (len == null || len > arr.length) len = arr.length; for (i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var logger = new Logger('liwi:resources-websocket-server');
var createWsServer = function createWsServer(server, path, resourcesServerService, getAuthenticatedUser) {
  var wss = new WebSocketServer({
    noServer: true
  });
  wss.on('connection', function (ws, authenticatedUser) {
    ws.isAlive = true;

    var sendMessage = function sendMessage(type, id, error, result) {
      if (!id) throw new Error('Invalid id');
      logger.debug('sendMessage', {
        type: type,
        id: id,
        error: error,
        result: result
      });
      ws.send(encode([type, id, error, result]));
    };

    var createSafeError = function createSafeError(error) {
      if (error instanceof ResourcesServerError) {
        return {
          code: error.code,
          message: error.message
        };
      }

      logger.error(error);
      return {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error'
      };
    };

    var sendAck = function sendAck(id, error, result) {
      sendMessage('ack', id, error && createSafeError(error), result);
    };

    var sendSubscriptionMessage = function sendSubscriptionMessage(subscriptionId, error, result) {
      sendMessage('subscription', subscriptionId, error && createSafeError(error), result);
    };

    var _createMessageHandler = createMessageHandler(resourcesServerService, authenticatedUser, true),
        messageHandler = _createMessageHandler.messageHandler,
        close = _createMessageHandler.close;

    var handleDecodedMessage = function handleDecodedMessage(message) {
      if (message.id == null) {
        return messageHandler(message, sendSubscriptionMessage).then(function () {});
      } else {
        return messageHandler(message, sendSubscriptionMessage).then(function (result) {
          sendAck(message.id, null, result);
        })["catch"](function (err) {
          sendAck(message.id, err);
        });
      }
    };

    ws.on('pong', function () {
      ws.isAlive = true;
    });
    ws.on('close', function (code, data) {
      var reason = data.toString();
      logger.debug('closed', {
        code: code,
        reason: reason
      });
      close();
    });
    ws.on('error', function (error) {
      logger.error('ws error', {
        error: error
      });
    });
    ws.on('message', function (data, isBinary) {
      if (isBinary) return; // eslint-disable-next-line @typescript-eslint/no-base-to-string

      var message = data.toString(),
          type,
          id,
          payload;
      if (message === 'close') return;

      if (typeof message !== 'string') {
        logger.warn('got non string message');
        return;
      }

      var decoded = decode(message);

      try {
        type = decoded[0], id = decoded[1], payload = decoded[2];
        logger.debug('received', {
          type: type,
          id: id,
          payload: payload
        }); // eslint-disable-next-line @typescript-eslint/no-floating-promises

        handleDecodedMessage({
          type: type,
          id: id,
          payload: payload
        });
      } catch (_unused) {
        logger.notice('invalid message', {
          decoded: decoded
        });
      }
    });
    ws.send('connection-ack');
  }); // https://www.npmjs.com/package/ws#how-to-detect-and-close-broken-connections

  var interval = setInterval(function () {
    wss.clients.forEach(function (ws) {
      var extWs = ws;

      if (!extWs.isAlive) {
        ws.terminate();
        return;
      }

      extWs.isAlive = false;
      ws.ping(null, undefined);
    });
  }, 60000);

  var handleUpgrade = function handleUpgrade(request, socket, upgradeHead) {
    if (request.url !== path) return;
    var authenticatedUserPromise = Promise.resolve(getAuthenticatedUser(request));
    wss.handleUpgrade(request, socket, upgradeHead, function (ws) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      authenticatedUserPromise["catch"](function (err) {
        logger.warn('getAuthenticatedUser threw an error, return null instead.', // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        {
          err: err
        });
        return null;
      }).then(function (authenticatedUser) {
        wss.emit('connection', ws, authenticatedUser);
      });
    });
  };

  server.on('upgrade', handleUpgrade);
  return {
    wss: wss,
    close: function close() {
      var _iterator, _step;

      wss.close();

      for (_iterator = _createForOfIteratorHelperLoose(wss.clients); !(_step = _iterator()).done;) {
        var ws = _step.value;
        ws.terminate();
      }

      server.removeListener('upgrade', handleUpgrade);
      clearInterval(interval);
    }
  };
};

export { createWsServer };
//# sourceMappingURL=index-browser.es.js.map
