'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var extendedJson = require('extended-json');
var liwiResourcesServer = require('liwi-resources-server');
var Logger = _interopDefault(require('nightingale-logger'));
var WebSocket = _interopDefault(require('ws'));

var logger = new Logger('liwi:resources-websocket-client');
var createWsServer = function createWsServer(server, path, resourcesServerService, getAuthenticatedUser) {
  if (path === void 0) {
    path = '/ws';
  }

  var wss = new WebSocket.Server({
    noServer: true
  });
  wss.on('connection', function (ws, authenticatedUser) {
    ws.isAlive = true;

    var sendMessage = function sendMessage(type, id, error, result) {
      if (!id) throw new Error('Invalid id');
      logger.debug('sendMessage', {
        type,
        id,
        error,
        result
      });
      ws.send(extendedJson.encode([type, id, error, result]));
    };

    var createSafeError = function createSafeError(error) {
      if (error instanceof liwiResourcesServer.ResourcesServerError) {
        return {
          code: error.code,
          message: error.message
        };
      }

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

    var _createMessageHandler = liwiResourcesServer.createMessageHandler(resourcesServerService, authenticatedUser, true),
        messageHandler = _createMessageHandler.messageHandler,
        close = _createMessageHandler.close;

    var handleDecodedMessage = function handleDecodedMessage(message) {
      if (message.id == null) {
        return messageHandler(message, sendSubscriptionMessage).then(function () {});
      } else {
        return messageHandler(message, sendSubscriptionMessage).then(function (result) {
          return sendAck(message.id, null, result);
        }).catch(function (err) {
          return sendAck(message.id, err);
        });
      }
    };

    ws.on('pong', function () {
      ws.isAlive = true;
    });
    ws.on('close', function () {
      close();
    });
    ws.on('message', function (message) {
      if (message === 'close') return;

      if (typeof message !== 'string') {
        logger.warn('got non string message');
        return;
      }

      var decoded = extendedJson.decode(message),
          type,
          id,
          payload;

      try {
        type = decoded[0], id = decoded[1], payload = decoded[2];
        logger.debug('received', {
          type,
          id,
          payload
        }); // eslint-disable-next-line @typescript-eslint/no-floating-promises

        handleDecodedMessage({
          type,
          id,
          payload
        });
      } catch (_unused) {
        logger.notice('invalid message', {
          decoded
        });
      }
    });
    ws.send('connection-ack');
  }); // https://www.npmjs.com/package/ws#how-to-detect-and-close-broken-connections

  var interval = setInterval(function () {
    wss.clients.forEach(function (ws) {
      var extWs = ws;
      if (!extWs.isAlive) return ws.terminate();
      extWs.isAlive = false;
      ws.ping(null, undefined);
    });
  }, 60000);

  var handleUpgrade = function handleUpgrade(request, socket, upgradeHead) {
    if (request.url !== path) return;
    var authenticatedUserPromise = Promise.resolve(getAuthenticatedUser(request));
    wss.handleUpgrade(request, socket, upgradeHead, function (ws) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      authenticatedUserPromise.catch(function (err) {
        logger.warn('getAuthenticatedUser threw an error, return null instead.', // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        {
          err
        });
        return null;
      }).then(function (authenticatedUser) {
        wss.emit('connection', ws, authenticatedUser);
      });
    });
  };

  server.on('upgrade', handleUpgrade);
  return {
    wss,

    close() {
      wss.close();
      server.removeListener('upgrade', handleUpgrade);
      clearInterval(interval);
    }

  };
};

exports.createWsServer = createWsServer;
//# sourceMappingURL=index-browser-dev.cjs.js.map
