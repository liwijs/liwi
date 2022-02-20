'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const extendedJson = require('extended-json');
const liwiResourcesServer = require('liwi-resources-server');
const nightingaleLogger = require('nightingale-logger');
const ws = require('ws');

/* eslint-disable max-lines */
const logger = new nightingaleLogger.Logger('liwi:resources-websocket-server');
const createWsServer = (server, path, resourcesServerService, getAuthenticatedUser) => {
  const wss = new ws.WebSocketServer({
    noServer: true
  });
  wss.on('connection', (ws, authenticatedUser) => {
    ws.isAlive = true;

    const sendMessage = (type, id, error, result) => {
      if (!id) throw new Error('Invalid id');
      logger.debug('sendMessage', {
        type,
        id,
        error,
        result
      });
      ws.send(extendedJson.encode([type, id, error, result]));
    };

    const createSafeError = error => {
      if (error instanceof liwiResourcesServer.ResourcesServerError) {
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

    const sendAck = (id, error, result) => {
      sendMessage('ack', id, error && createSafeError(error), result);
    };

    const sendSubscriptionMessage = (subscriptionId, error, result) => {
      sendMessage('subscription', subscriptionId, error && createSafeError(error), result);
    };

    const {
      messageHandler,
      close
    } = liwiResourcesServer.createMessageHandler(resourcesServerService, authenticatedUser, true);

    const handleDecodedMessage = message => {
      if (message.id == null) {
        return messageHandler(message, sendSubscriptionMessage).then(() => {});
      } else {
        return messageHandler(message, sendSubscriptionMessage).then(result => {
          sendAck(message.id, null, result);
        }).catch(err => {
          sendAck(message.id, err);
        });
      }
    };

    ws.on('pong', () => {
      ws.isAlive = true;
    });
    ws.on('close', (code, data) => {
      const reason = data.toString();
      logger.debug('closed', {
        code,
        reason
      });
      close();
    });
    ws.on('error', error => {
      logger.error('ws error', {
        error
      });
    });
    ws.on('message', (data, isBinary) => {
      if (isBinary) return; // eslint-disable-next-line @typescript-eslint/no-base-to-string

      const message = data.toString();
      if (message === 'close') return;

      if (typeof message !== 'string') {
        logger.warn('got non string message');
        return;
      }

      const decoded = extendedJson.decode(message);

      try {
        const [type, id, payload] = decoded;
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
      } catch {
        logger.notice('invalid message', {
          decoded
        });
      }
    });
    ws.send('connection-ack');
  }); // https://www.npmjs.com/package/ws#how-to-detect-and-close-broken-connections

  const interval = setInterval(() => {
    wss.clients.forEach(ws => {
      const extWs = ws;

      if (!extWs.isAlive) {
        ws.terminate();
        return;
      }

      extWs.isAlive = false;
      ws.ping(null, undefined);
    });
  }, 60000);

  const handleUpgrade = (request, socket, upgradeHead) => {
    if (request.url !== path) return;
    const authenticatedUserPromise = Promise.resolve(getAuthenticatedUser(request));
    wss.handleUpgrade(request, socket, upgradeHead, ws => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      authenticatedUserPromise.catch(err => {
        logger.warn('getAuthenticatedUser threw an error, return null instead.', // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        {
          err
        });
        return null;
      }).then(authenticatedUser => {
        wss.emit('connection', ws, authenticatedUser);
      });
    });
  };

  server.on('upgrade', handleUpgrade);
  return {
    wss,

    close() {
      wss.close();

      for (const ws of wss.clients) {
        ws.terminate();
      }

      server.removeListener('upgrade', handleUpgrade);
      clearInterval(interval);
    }

  };
};

exports.createWsServer = createWsServer;
//# sourceMappingURL=index-node14.cjs.map
