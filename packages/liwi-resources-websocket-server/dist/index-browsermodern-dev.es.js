import { decode, encode } from 'extended-json';
import { createMessageHandler, ResourcesServerError } from 'liwi-resources-server';
import Logger from 'nightingale-logger';
import WebSocket from 'ws';

/* eslint-disable complexity, max-lines */
const logger = new Logger('liwi:resources-websocket-client');
const createWsServer = function createWsServer(server, path = '/ws', resourcesServerService, getAuthenticatedUser) {
  const wss = new WebSocket.Server({
    noServer: true
  });
  wss.on('connection', function (ws, authenticatedUser) {
    ws.isAlive = true;

    const sendMessage = function sendMessage(type, id, error, result) {
      if (!id) throw new Error('Invalid id');
      logger.debug('sendMessage', {
        type,
        id,
        error,
        result
      });
      ws.send(encode([type, id, error, result]));
    };

    const createSafeError = function createSafeError(error) {
      if (error instanceof ResourcesServerError) {
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

    const sendAck = function sendAck(id, error, result) {
      sendMessage('ack', id, error && createSafeError(error), result);
    };

    const sendSubscriptionMessage = function sendSubscriptionMessage(subscriptionId, error, result) {
      sendMessage('subscription', subscriptionId, error && createSafeError(error), result);
    };

    const {
      messageHandler,
      close
    } = createMessageHandler(resourcesServerService, authenticatedUser, true);

    const handleDecodedMessage = function handleDecodedMessage(message) {
      return messageHandler(message, sendSubscriptionMessage).then(function (result) {
        return sendAck(message.id, null, result);
      }).catch(function (err) {
        return sendAck(message.id, err);
      });
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

      const decoded = decode(message);

      try {
        const [type, id, payload] = decoded;
        logger.debug('received', {
          type,
          id,
          payload
        });
        handleDecodedMessage({
          type,
          id,
          payload
        });
      } catch (err) {
        logger.notice('invalid message', {
          decoded
        });
      }
    });
    ws.send('connection-ack');
  }); // https://www.npmjs.com/package/ws#how-to-detect-and-close-broken-connections

  const interval = setInterval(function () {
    wss.clients.forEach(function (ws) {
      const extWs = ws;
      if (!extWs.isAlive) return ws.terminate();
      extWs.isAlive = false;
      ws.ping(null, undefined);
    });
  }, 60000);

  const handleUpgrade = function handleUpgrade(request, socket, upgradeHead) {
    if (request.url !== path) return;
    const authenticatedUserPromise = Promise.resolve(getAuthenticatedUser(request));
    wss.handleUpgrade(request, socket, upgradeHead, function (ws) {
      authenticatedUserPromise.catch(function (err) {
        logger.warn('getAuthenticatedUser threw an error, return null instead.', {
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

export { createWsServer };
//# sourceMappingURL=index-browsermodern-dev.es.js.map
