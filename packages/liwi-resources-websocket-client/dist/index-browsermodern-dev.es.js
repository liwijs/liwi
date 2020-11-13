import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import { decode, encode } from 'extended-json';
import { ResourcesServerError } from 'liwi-resources-client';
import Logger from 'nightingale-logger';
import Backoff from 'backo2';

/* eslint-disable unicorn/prefer-add-event-listener, max-lines */
function createSimpleWebsocketClient({
  url,
  protocols,
  reconnection = true,
  reconnectionDelayMin = 1000,
  reconnectionDelayMax = 30000,
  reconnectionAttempts = Infinity,
  onMessage,
  onError
}) {
  let ws = null;
  let currentState = 'closed';
  let isConnected = false;
  const stateChangeListeners = new Set();
  const backoff = new Backoff({
    min: reconnectionDelayMin,
    max: reconnectionDelayMax,
    factor: 1.2
  });
  const timeouts = {
    maxConnect: null,
    tryReconnect: null,
    inactivity: null
  };

  const setCurrentState = function setCurrentState(newState) {
    if (currentState === newState) return;
    currentState = newState;
    isConnected = currentState === 'connected';
    stateChangeListeners.forEach(function (listener) {
      return listener(newState);
    });
  };

  const clearInternalTimeout = function clearInternalTimeout(timeoutKey) {
    const timeout = timeouts[timeoutKey];

    if (timeout) {
      clearTimeout(timeout);
      timeouts[timeoutKey] = null;
    }
  };

  const closeWebsocket = function closeWebsocket() {
    clearInternalTimeout('inactivity');

    if (ws) {
      clearInternalTimeout('maxConnect');
      clearInternalTimeout('tryReconnect');
      ws = null;
      setCurrentState('closed');
    }
  };

  let tryReconnect;

  const connect = function connect() {
    const webSocket = new WebSocket(url, protocols);
    ws = webSocket;
    clearInternalTimeout('maxConnect');
    setCurrentState('connecting');

    webSocket.onopen = function () {
      backoff.reset();
      clearInternalTimeout('maxConnect');
    };

    const handleCloseOrError = function handleCloseOrError() {
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
      const delay = backoff.duration();
      timeouts.tryReconnect = setTimeout(function () {
        connect();
      }, delay);
    };
  }

  const visibilityChangHandler = !tryReconnect ? undefined : function () {
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

  return {
    connect,

    close() {
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

    isConnected() {
      return isConnected;
    },

    sendMessage(message) {
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
}

const logger = new Logger('liwi:resources-websocket-client');

class SubscribeResultPromise {
  // readonly changePayload: TransportClientSubscribeResult<
  //   Result,
  //   Payload
  // >['changePayload'];
  constructor({
    executor,
    stop
  }) {
    this.promise = new Promise(function (resolve, reject) {
      return executor(resolve, reject);
    });
    this.stop = stop;
    this.cancel = stop; // this.changePayload = changePayload;
  }

  then(onfulfilled, onrejected) {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch(onrejected) {
    return this.promise.catch(onrejected);
  }

} // TODO handle resubscriptions after reconnect (or in useEffect ?)
// TODO handle send before connected
// TODO reject on connection close OR keep promise hang ?


const createSafeError = function createSafeError(error) {
  return new ResourcesServerError(error.code, error.message);
};

function createResourcesWebsocketClient(_ref) {
  let {
    url
  } = _ref,
      options = _objectWithoutPropertiesLoose(_ref, ["url"]);

  let currentId = 1;
  let currentSubscriptionId = 1;
  const acks = new Map(); // TODO in progress / unsent / sending => find better name

  const subscriptions = new Map();

  if (!url) {
    url = `ws${window.location.protocol === 'https:' ? 's' : ''}://${window.location.host}/ws`;
  }

  logger.info('create', {
    url
  });
  const handlers = {
    ack: function ack(id, error, result) {
      logger.debug('ack', {
        id
      });
      const ack = acks.get(id);

      if (!ack) {
        logger.warn('no ack found', {
          id
        });
      } else if (error) {
        ack.reject(createSafeError(error));
      } else {
        ack.resolve(result);
      }
    },
    subscription: function subscription(id, error, result) {
      logger.debug('subscription', {
        id
      });
      const subscription = subscriptions.get(id);

      if (!subscription) {
        if (id < currentSubscriptionId) {
          logger.warn('subscription previously closed', {
            id
          });
        } else {
          logger.warn('no subscription found', {
            id
          });
        }
      } else if (error) {
        subscription.callback(createSafeError(error), null);
      } else {
        subscription.callback(null, result);
      }
    }
  };
  const wsClient = createSimpleWebsocketClient(Object.assign({}, options, {
    url,
    onMessage: function onMessage(event) {
      logger.info('message', {
        data: event.data
      });
      const [type, id, error, result] = decode(event.data);
      const handler = handlers[type];

      if (handler) {
        handler(id, error, result);
      }
    }
  }));

  const sendMessage = function sendMessage(type, id, payload) {
    return wsClient.sendMessage(encode([type, id, payload]));
  };

  const sendWithAck = function sendWithAck(type, message) {
    return new Promise(function (resolve, reject) {
      const id = currentId++;
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

  const sendThrowNotConnected = function sendThrowNotConnected() {
    const error = new Error('Websocket not connected');
    error.name = 'NetworkError';
    throw error;
  };

  const resourcesClient = {
    connect: function connect() {
      return wsClient.connect();
    },
    close: function close() {
      return wsClient.close();
    },
    listenStateChange: wsClient.listenStateChange,
    send: sendThrowNotConnected,
    subscribe: function subscribe(type, messageWithoutSubscriptionId, callback) {
      const id = currentId++;
      const subscriptionId = currentSubscriptionId++;
      const message = Object.assign({}, messageWithoutSubscriptionId, {
        subscriptionId
      });
      return new SubscribeResultPromise({
        executor: function executor(resolve, reject) {
          subscriptions.set(subscriptionId, {
            type,
            message,
            resolve,
            reject,
            callback
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
              subscriptionId
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
      newState
    });

    if (newState === 'connected') {
      resourcesClient.send = sendWithAck;
      subscriptions.forEach(function (subscription) {
        sendWithAck(subscription.type, subscription.message).then(subscription.resolve, subscription.reject);
      });
    } else {
      resourcesClient.send = sendThrowNotConnected;
      acks.forEach(function (ack) {
        ack.reject(new Error(`Failed to get ack, connection state is now ${newState}`));
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
//# sourceMappingURL=index-browsermodern-dev.es.js.map
