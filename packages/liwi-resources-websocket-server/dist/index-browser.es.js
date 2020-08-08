import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import { decode, encode } from 'extended-json';
import { ResourcesServerError } from 'liwi-resources-server';
import Logger from 'nightingale-logger';
import WebSocket from 'ws';

var logger = new Logger('liwi:resources-websocket-client');
var createWsServer = function createWsServer(server, path, resourcesServerService, getAuthenticatedUser) {
  if (path === void 0) {
    path = '/ws';
  }

  var wss = new WebSocket.Server({
    noServer: true
  });

  var getResource = function getResource(payload) {
    logger.debug('resource', {
      resourceName: payload.resourceName
    });
    var resource = resourcesServerService.getServiceResource(payload.resourceName);
    return resource;
  };

  var createQuery = function createQuery(payload, resource, authenticatedUser) {
    if (!payload.key.startsWith('query')) {
      throw new Error('Invalid query key');
    }

    return resource.queries[payload.key](payload.params, authenticatedUser);
  };

  wss.on('connection', function (ws, authenticatedUser) {
    ws.isAlive = true;
    var openSubscriptions = new Map();

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

      return {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error'
      };
    };

    var sendAck = function sendAck(id, error, result) {
      sendMessage('ack', id, error && createSafeError(error), result);
    };

    var logUnexpectedError = function logUnexpectedError(error, message, payload) {
      if (!(error instanceof ResourcesServerError)) {
        logger.error(message, {
          error: error,
          payload: 'redacted'
        });
      }
    };

    var logUnexpectedErrorAndSendAck = function logUnexpectedErrorAndSendAck(message, error) {
      logUnexpectedError(error, message.type, message.payload);
      sendAck(message.id, error);
    };

    var sendSubscriptionMessage = function sendSubscriptionMessage(subscriptionId, error, result) {
      sendMessage('subscription', subscriptionId, error && createSafeError(error), result);
    };

    var createSubscription = function createSubscription(type, id, payload, resource, query) {
      var subscriptionId = payload.subscriptionId;

      if (openSubscriptions.has(subscriptionId)) {
        logger.warn("Already have a watcher for this id. Cannot add a new one", {
          subscriptionId: subscriptionId,
          key: payload.key
        });
        throw new ResourcesServerError('ALREADY_HAVE_WATCHER', "Already have a watcher for this id. Cannot add a new one");
      }

      var subscription = query[type](function (error, result) {
        if (error) {
          logUnexpectedError(error, type);
        }

        sendSubscriptionMessage(subscriptionId, error, result);
      });
      subscription.then(function () {
        return sendAck(id, null);
      }, function (err) {
        logger.error(type, {
          err: err
        });
        sendAck(id, err);
      });
      var subscribeHook = resource.subscribeHooks && resource.subscribeHooks[payload.key];
      openSubscriptions.set(subscriptionId, {
        subscription: subscription,
        subscribeHook: subscribeHook,
        params: subscribeHook ? payload.params : undefined
      });

      if (subscribeHook) {
        subscribeHook.subscribed(authenticatedUser, payload.params);
      }
    };

    var unsubscribeSubscription = function unsubscribeSubscription(_ref) {
      var subscription = _ref.subscription,
          subscribeHook = _ref.subscribeHook,
          params = _ref.params;
      subscription.stop();

      if (subscribeHook) {
        subscribeHook.unsubscribed(authenticatedUser, params);
      }
    };

    var handleDecodedMessage = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(message) {
        var resource, query, _resource, _query, _resource2, _query2, subscriptionId, _SubscriptionAndSubscribeHook, _resource3, _message$payload, operationKey, params, operation;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.t0 = message.type;
                _context.next = _context.t0 === 'fetch' ? 3 : _context.t0 === 'fetchAndSubscribe' ? 14 : _context.t0 === 'subscribe' ? 16 : _context.t0 === 'subscribe:close' ? 18 : _context.t0 === 'do' ? 20 : 33;
                break;

              case 3:
                _context.prev = 3;
                resource = getResource(message.payload);
                query = createQuery(message.payload, resource, authenticatedUser);
                _context.next = 8;
                return query.fetch(function (result) {
                  return sendAck(message.id, null, result);
                });

              case 8:
                _context.next = 13;
                break;

              case 10:
                _context.prev = 10;
                _context.t1 = _context["catch"](3);
                logUnexpectedErrorAndSendAck(message, _context.t1);

              case 13:
                return _context.abrupt("break", 33);

              case 14:
                try {
                  _resource = getResource(message.payload);
                  _query = createQuery(message.payload, _resource, authenticatedUser);
                  createSubscription('fetchAndSubscribe', message.id, message.payload, _resource, _query);
                } catch (err) {
                  logUnexpectedErrorAndSendAck(message, err);
                }

                return _context.abrupt("break", 33);

              case 16:
                try {
                  _resource2 = getResource(message.payload);
                  _query2 = createQuery(message.payload, _resource2, authenticatedUser);
                  createSubscription('subscribe', message.id, message.payload, _resource2, _query2);
                } catch (err) {
                  logUnexpectedErrorAndSendAck(message, err);
                }

                return _context.abrupt("break", 33);

              case 18:
                try {
                  subscriptionId = message.payload.subscriptionId;
                  _SubscriptionAndSubscribeHook = openSubscriptions.get(subscriptionId);

                  if (!_SubscriptionAndSubscribeHook) {
                    logger.warn('tried to unsubscribe non existing watcher', {
                      subscriptionId: subscriptionId
                    });
                  } else {
                    openSubscriptions.delete(subscriptionId);
                    unsubscribeSubscription(_SubscriptionAndSubscribeHook);
                  }
                } catch (err) {
                  logUnexpectedError(err, message.type, message.payload);
                }

                return _context.abrupt("break", 33);

              case 20:
                _context.prev = 20;
                _resource3 = getResource(message.payload);
                _message$payload = message.payload, operationKey = _message$payload.operationKey, params = _message$payload.params;
                operation = _resource3.operations[operationKey];

                if (operation) {
                  _context.next = 26;
                  break;
                }

                throw new ResourcesServerError('OPERATION_NOT_FOUND', "Operation not found: " + operationKey);

              case 26:
                operation(params, authenticatedUser).then(function (result) {
                  return sendAck(message.id, null, result);
                }, function (err) {
                  logUnexpectedErrorAndSendAck(message, err);
                });
                _context.next = 32;
                break;

              case 29:
                _context.prev = 29;
                _context.t2 = _context["catch"](20);
                logUnexpectedErrorAndSendAck(message, _context.t2);

              case 32:
                return _context.abrupt("break", 33);

              case 33:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 10], [20, 29]]);
      }));

      return function handleDecodedMessage() {
        return _ref2.apply(this, arguments);
      };
    }();

    ws.on('pong', function () {
      ws.isAlive = true;
    });
    ws.on('close', function () {
      openSubscriptions.forEach(unsubscribeSubscription);
    });
    ws.on('message', function (message) {
      if (message === 'close') return;

      if (typeof message !== 'string') {
        logger.warn('got non string message');
        return;
      }

      var decoded = decode(message),
          type,
          id,
          payload;

      try {
        type = decoded[0], id = decoded[1], payload = decoded[2];
        logger.debug('received', {
          type: type,
          id: id,
          payload: payload
        });
        handleDecodedMessage({
          type: type,
          id: id,
          payload: payload
        });
      } catch (err) {
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
      if (!extWs.isAlive) return ws.terminate();
      extWs.isAlive = false;
      ws.ping(null, undefined);
    });
  }, 60000);

  var handleUpgrade = function handleUpgrade(request, socket, upgradeHead) {
    if (request.url !== path) return;
    var authenticatedUser = getAuthenticatedUser(request);
    wss.handleUpgrade(request, socket, upgradeHead, function (ws) {
      wss.emit('connection', ws, authenticatedUser);
    });
  };

  server.on('upgrade', handleUpgrade);
  return {
    wss: wss,
    close: function close() {
      wss.close();
      server.removeListener('upgrade', handleUpgrade);
      clearInterval(interval);
    }
  };
};

export { createWsServer };
//# sourceMappingURL=index-browser.es.js.map
