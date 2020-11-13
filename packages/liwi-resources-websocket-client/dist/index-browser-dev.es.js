import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import { decode, encode } from 'extended-json';
import { ResourcesServerError } from 'liwi-resources-client';
import Logger from 'nightingale-logger';
import Backoff from 'backo2';

/* eslint-disable unicorn/prefer-add-event-listener, max-lines */
function createSimpleWebsocketClient(_ref) {
  var url = _ref.url,
      protocols = _ref.protocols,
      _ref$reconnection = _ref.reconnection,
      reconnection = _ref$reconnection === void 0 ? true : _ref$reconnection,
      _ref$reconnectionDela = _ref.reconnectionDelayMin,
      reconnectionDelayMin = _ref$reconnectionDela === void 0 ? 1000 : _ref$reconnectionDela,
      _ref$reconnectionDela2 = _ref.reconnectionDelayMax,
      reconnectionDelayMax = _ref$reconnectionDela2 === void 0 ? 30000 : _ref$reconnectionDela2,
      _ref$reconnectionAtte = _ref.reconnectionAttempts,
      reconnectionAttempts = _ref$reconnectionAtte === void 0 ? Infinity : _ref$reconnectionAtte,
      onMessage = _ref.onMessage,
      onError = _ref.onError;
  var ws = null;
  var currentState = 'closed';
  var isConnected = false;
  var stateChangeListeners = new Set();
  var backoff = new Backoff({
    min: reconnectionDelayMin,
    max: reconnectionDelayMax,
    factor: 1.2
  });
  var timeouts = {
    maxConnect: null,
    tryReconnect: null,
    inactivity: null
  };

  var setCurrentState = function setCurrentState(newState) {
    if (currentState === newState) return;
    currentState = newState;
    isConnected = currentState === 'connected';
    stateChangeListeners.forEach(function (listener) {
      return listener(newState);
    });
  };

  var clearInternalTimeout = function clearInternalTimeout(timeoutKey) {
    var timeout = timeouts[timeoutKey];

    if (timeout) {
      clearTimeout(timeout);
      timeouts[timeoutKey] = null;
    }
  };

  var closeWebsocket = function closeWebsocket() {
    clearInternalTimeout('inactivity');

    if (ws) {
      clearInternalTimeout('maxConnect');
      clearInternalTimeout('tryReconnect');
      ws = null;
      setCurrentState('closed');
    }
  };

  var tryReconnect;

  var connect = function connect() {
    var webSocket = new WebSocket(url, protocols);
    ws = webSocket;
    clearInternalTimeout('maxConnect');
    setCurrentState('connecting');

    webSocket.onopen = function () {
      backoff.reset();
      clearInternalTimeout('maxConnect');
    };

    var handleCloseOrError = function handleCloseOrError() {
      if (currentState === 'closed') return;

      if (!tryReconnect) {
        closeWebsocket();
      } else if (document.visibilityState === 'hidden') {
        setCurrentState('wait-for-visibility');
      } else {
        tryReconnect();
      }
    };

    webSocket.onclose = handleCloseOrError;

    webSocket.onmessage = function (message) {
      if (message.data === 'connection-ack') {
        setCurrentState('connected');
      } else {
        onMessage(message);
      }
    };

    webSocket.onerror = function (event) {
      console.error('ws error', event);
      if (onError) onError(event);
      handleCloseOrError();
    };
  };

  if (reconnection) {
    tryReconnect = function tryReconnect() {
      if (backoff.attempts >= reconnectionAttempts) {
        return;
      }

      if (currentState === 'reconnect-scheduled') {
        return;
      }

      setCurrentState('reconnect-scheduled');
      clearInternalTimeout('tryReconnect');
      var delay = backoff.duration();
      timeouts.tryReconnect = setTimeout(function () {
        connect();
      }, delay);
    };
  }

  var visibilityChangHandler = !tryReconnect ? undefined : function () {
    if (document.visibilityState === 'hidden') {
      if (currentState === 'reconnect-scheduled') {
        setCurrentState('wait-for-visibility');

        if (timeouts.tryReconnect !== null) {
          clearTimeout(timeouts.tryReconnect);
        }
      }

      return;
    }

    if (currentState !== 'wait-for-visibility') return;

    if (tryReconnect) {
      backoff.reset();
      tryReconnect();
    }
  };

  if (visibilityChangHandler) {
    window.addEventListener('visibilitychange', visibilityChangHandler);
  }

  var wsTransport = {
    connect: connect,
    close: function close() {
      if (ws) {
        if (currentState === 'connected') {
          ws.send('close');
        }

        closeWebsocket();
      }

      if (visibilityChangHandler) {
        window.removeEventListener('visibilitychange', visibilityChangHandler);
      }
    },
    isConnected: function (_isConnected) {
      function isConnected() {
        return _isConnected.apply(this, arguments);
      }

      isConnected.toString = function () {
        return _isConnected.toString();
      };

      return isConnected;
    }(function () {
      return isConnected;
    }),
    sendMessage: function sendMessage(message) {
      if (!ws) throw new Error('Cannot send message');
      ws.send(message);
    },
    listenStateChange: function listenStateChange(listener) {
      stateChangeListeners.add(listener);
      return function () {
        stateChangeListeners.delete(listener);
      };
    }
  };
  return wsTransport;
}

var logger = new Logger('liwi:resources-websocket-client');

var SubscribeResultPromise = /*#__PURE__*/function () {
  // readonly changePayload: TransportClientSubscribeResult<
  //   Result,
  //   Payload
  // >['changePayload'];
  function SubscribeResultPromise(_ref) {
    var executor = _ref.executor,
        stop = _ref.stop;
    this.promise = new Promise(function (resolve, reject) {
      return executor(resolve, reject);
    });
    this.stop = stop;
    this.cancel = stop; // this.changePayload = changePayload;
  }

  var _proto = SubscribeResultPromise.prototype;

  _proto.then = function then(onfulfilled, onrejected) {
    return this.promise.then(onfulfilled, onrejected);
  };

  _proto.catch = function _catch(onrejected) {
    return this.promise.catch(onrejected);
  };

  return SubscribeResultPromise;
}(); // TODO handle resubscriptions after reconnect (or in useEffect ?)
// TODO handle send before connected
// TODO reject on connection close OR keep promise hang ?


var createSafeError = function createSafeError(error) {
  return new ResourcesServerError(error.code, error.message);
};

function createResourcesWebsocketClient(_ref2) {
  var url = _ref2.url,
      options = _objectWithoutPropertiesLoose(_ref2, ["url"]);

  var currentId = 1;
  var currentSubscriptionId = 1;
  var acks = new Map(); // TODO in progress / unsent / sending => find better name

  var subscriptions = new Map();

  if (!url) {
    url = "ws" + (window.location.protocol === 'https:' ? 's' : '') + "://" + window.location.host + "/ws";
  }

  logger.info('create', {
    url: url
  });
  var handlers = {
    ack: function ack(id, error, result) {
      logger.debug('ack', {
        id: id
      });
      var ack = acks.get(id);

      if (!ack) {
        logger.warn('no ack found', {
          id: id
        });
      } else if (error) {
        ack.reject(createSafeError(error));
      } else {
        ack.resolve(result);
      }
    },
    subscription: function subscription(id, error, result) {
      logger.debug('subscription', {
        id: id
      });
      var subscription = subscriptions.get(id);

      if (!subscription) {
        if (id < currentSubscriptionId) {
          logger.warn('subscription previously closed', {
            id: id
          });
        } else {
          logger.warn('no subscription found', {
            id: id
          });
        }
      } else if (error) {
        subscription.callback(createSafeError(error), null);
      } else {
        subscription.callback(null, result);
      }
    }
  };
  var wsClient = createSimpleWebsocketClient(Object.assign({}, options, {
    url: url,
    onMessage: function onMessage(event) {
      logger.info('message', {
        data: event.data
      });

      var _decode = decode(event.data),
          type = _decode[0],
          id = _decode[1],
          error = _decode[2],
          result = _decode[3];

      var handler = handlers[type];

      if (handler) {
        handler(id, error, result);
      }
    }
  }));

  var sendMessage = function sendMessage(type, id, payload) {
    return wsClient.sendMessage(encode([type, id, payload]));
  };

  var sendWithAck = function sendWithAck(type, message) {
    return new Promise(function (resolve, reject) {
      var id = currentId++;
      acks.set(id, {
        resolve: function (_resolve) {
          function resolve() {
            return _resolve.apply(this, arguments);
          }

          resolve.toString = function () {
            return _resolve.toString();
          };

          return resolve;
        }(function (result) {
          acks.delete(id);
          resolve(result);
        }),
        reject: function (_reject) {
          function reject() {
            return _reject.apply(this, arguments);
          }

          reject.toString = function () {
            return _reject.toString();
          };

          return reject;
        }(function (err) {
          acks.delete(id);
          reject(err);
        })
      });
      sendMessage(type, id, message);
    });
  };

  var sendThrowNotConnected = function sendThrowNotConnected() {
    var error = new Error('Websocket not connected');
    error.name = 'NetworkError';
    throw error;
  };

  var resourcesClient = {
    connect: function connect() {
      return wsClient.connect();
    },
    close: function close() {
      return wsClient.close();
    },
    listenStateChange: wsClient.listenStateChange,
    send: sendThrowNotConnected,
    subscribe: function subscribe(type, messageWithoutSubscriptionId, callback) {
      var id = currentId++;
      var subscriptionId = currentSubscriptionId++;
      var message = Object.assign({}, messageWithoutSubscriptionId, {
        subscriptionId: subscriptionId
      });
      return new SubscribeResultPromise({
        executor: function executor(resolve, reject) {
          subscriptions.set(subscriptionId, {
            type: type,
            message: message,
            resolve: resolve,
            reject: reject,
            callback: callback
          });

          if (wsClient.isConnected()) {
            // TODO reject should remove subscription ?
            sendWithAck(type, message).then(resolve, reject);
          }
        },
        stop: function stop() {
          acks.delete(id);
          subscriptions.delete(subscriptionId); // TODO what if reconnect (backend keeps subscription) and closed at this time ?

          if (wsClient.isConnected()) {
            sendMessage('subscribe:close', null, {
              subscriptionId: subscriptionId
            });
          }
        } // changePayload: (payload: Payload): Promise<void> => {
        //   return new Promise((resolve, reject) => {
        //     const subscription = subscriptions.get(subscriptionId);
        //     if (!subscription) return reject(new Error('Invalid subscription'));
        //     subscription.message.payload = payload;
        //     if (wsClient.isConnected()) {
        //       sendWithAck('subscribe:changePayload', payload).then(
        //         resolve,
        //         reject,
        //       );
        //     } else {
        //       return reject(new Error('Not connected'));
        //     }
        //   });
        // },

      });
    }
  };
  wsClient.listenStateChange(function (newState) {
    logger.info('newState', {
      newState: newState
    });

    if (newState === 'connected') {
      resourcesClient.send = sendWithAck;
      subscriptions.forEach(function (subscription) {
        sendWithAck(subscription.type, subscription.message).then(subscription.resolve, subscription.reject);
      });
    } else {
      resourcesClient.send = sendThrowNotConnected;
      acks.forEach(function (ack) {
        ack.reject(new Error("Failed to get ack, connection state is now " + newState));
      });
      acks.clear();

      if (newState === 'closed') {
        subscriptions.forEach(function (subscription) {
          subscription.reject(new Error('Subscription closed'));
        });
      }
    }
  });
  return resourcesClient;
}

export { createResourcesWebsocketClient as createWebsocketTransportClient };
//# sourceMappingURL=index-browser-dev.es.js.map
