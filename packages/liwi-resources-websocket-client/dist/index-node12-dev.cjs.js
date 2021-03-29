'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const extendedJson = require('extended-json');
const liwiResourcesClient = require('liwi-resources-client');
const Logger = require('nightingale-logger');
const Backoff = require('backo2');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const Logger__default = /*#__PURE__*/_interopDefaultLegacy(Logger);
const Backoff__default = /*#__PURE__*/_interopDefaultLegacy(Backoff);

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
  const backoff = new Backoff__default({
    min: reconnectionDelayMin,
    max: reconnectionDelayMax,
    factor: 1.2
  });
  const timeouts = {
    maxConnect: null,
    tryReconnect: null,
    inactivity: null
  };

  const setCurrentState = newState => {
    if (currentState === newState) return;
    currentState = newState;
    isConnected = currentState === 'connected';
    stateChangeListeners.forEach(listener => {
      listener(newState);
    });
  };

  const clearInternalTimeout = timeoutKey => {
    const timeout = timeouts[timeoutKey];

    if (timeout) {
      clearTimeout(timeout);
      timeouts[timeoutKey] = null;
    }
  };

  const closeWebsocket = () => {
    clearInternalTimeout('inactivity');

    if (ws) {
      clearInternalTimeout('maxConnect');
      clearInternalTimeout('tryReconnect');
      ws = null;
      setCurrentState('closed');
    }
  };

  let tryReconnect;

  const connect = () => {
    const webSocket = new WebSocket(url, protocols);
    ws = webSocket;
    clearInternalTimeout('maxConnect');
    setCurrentState('connecting');

    webSocket.onopen = () => {
      backoff.reset();
      clearInternalTimeout('maxConnect');
    };

    const handleCloseOrError = () => {
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

    webSocket.onmessage = message => {
      if (message.data === 'connection-ack') {
        setCurrentState('connected');
      } else {
        onMessage(message);
      }
    };

    webSocket.onerror = event => {
      if (onError) {
        onError(event);
      } else {
        console.error('ws error', event);
      }

      handleCloseOrError();
    };
  };

  if (reconnection) {
    tryReconnect = () => {
      if (backoff.attempts >= reconnectionAttempts) {
        return;
      }

      if (currentState === 'reconnect-scheduled') {
        return;
      }

      setCurrentState('reconnect-scheduled');
      clearInternalTimeout('tryReconnect');
      const delay = backoff.duration();
      timeouts.tryReconnect = setTimeout(() => {
        connect();
      }, delay);
    };
  }

  const visibilityChangHandler = !tryReconnect ? undefined : () => {
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

    listenStateChange: listener => {
      stateChangeListeners.add(listener);
      return () => {
        stateChangeListeners.delete(listener);
      };
    }
  };
}

/* eslint-disable max-lines */
const logger = new Logger__default('liwi:resources-websocket-client');

class SubscribeResultPromise {
  // readonly changePayload: TransportClientSubscribeResult<
  //   Result,
  //   Payload
  // >['changePayload'];
  constructor({
    executor,
    stop
  }) {
    this.promise = new Promise((resolve, reject) => {
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


const createSafeError = error => {
  return new liwiResourcesClient.ResourcesServerError(error.code, error.message);
};

function createResourcesWebsocketClient({
  url,
  ...options
}) {
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
    ack: (id, error, result) => {
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
    subscription: (id, error, result) => {
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
  const wsClient = createSimpleWebsocketClient({ ...options,
    url,
    onMessage: event => {
      logger.debug('message', {
        data: event.data
      });
      const [type, id, error, result] = extendedJson.decode(event.data);
      const handler = handlers[type];

      if (handler) {
        handler(id, error, result);
      }
    }
  });

  const sendMessage = (type, id, payload) => wsClient.sendMessage(extendedJson.encode([type, id, payload]));

  const sendWithAck = (type, message) => {
    return new Promise((resolve, reject) => {
      const id = currentId++;
      acks.set(id, {
        resolve: result => {
          acks.delete(id);
          resolve(result);
        },
        reject: err => {
          acks.delete(id);
          reject(err);
        }
      });
      sendMessage(type, id, message);
    });
  };

  const sendThrowNotConnected = () => {
    const error = new Error('Websocket not connected');
    error.name = 'NetworkError';
    throw error;
  };

  const resourcesClient = {
    connect: () => wsClient.connect(),
    close: () => wsClient.close(),
    listenStateChange: wsClient.listenStateChange,
    send: sendThrowNotConnected,
    subscribe: (type, messageWithoutSubscriptionId, callback) => {
      const id = currentId++;
      const subscriptionId = currentSubscriptionId++;
      const message = { ...messageWithoutSubscriptionId,
        subscriptionId
      };
      return new SubscribeResultPromise({
        executor: (resolve, reject) => {
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
        stop: () => {
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
  wsClient.listenStateChange(newState => {
    logger.info('newState', {
      newState
    });

    if (newState === 'connected') {
      resourcesClient.send = sendWithAck;
      subscriptions.forEach(subscription => {
        sendWithAck(subscription.type, subscription.message).then(subscription.resolve, subscription.reject);
      });
    } else {
      resourcesClient.send = sendThrowNotConnected;
      acks.forEach(ack => {
        ack.reject(new Error(`Failed to get ack, connection state is now ${newState}`));
      });
      acks.clear();

      if (newState === 'closed') {
        subscriptions.forEach(subscription => {
          subscription.reject(new Error('Subscription closed'));
        });
      }
    }
  });
  return resourcesClient;
}

exports.createWebsocketTransportClient = createResourcesWebsocketClient;
//# sourceMappingURL=index-node12-dev.cjs.js.map
