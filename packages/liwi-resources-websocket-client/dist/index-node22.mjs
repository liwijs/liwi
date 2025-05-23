import { decode, encode } from 'extended-json';
import { ResourcesServerError } from 'liwi-resources-client';
import { Logger } from 'nightingale-logger';
import Backoff from 'backo2';

function createSimpleWebsocketClient({
  url,
  protocols,
  reconnection = true,
  reconnectionDelayMin = 1000,
  reconnectionDelayMax = 30000,
  reconnectionAttempts = Infinity,
  thirdWebsocketArgument,
  onMessage,
  onError
}) {
  let ws = null;
  let currentState = "closed";
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
  const setCurrentState = newState => {
    if (currentState === newState) return;
    currentState = newState;
    isConnected = currentState === "connected";
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
    clearInternalTimeout("inactivity");
    if (ws) {
      clearInternalTimeout("maxConnect");
      clearInternalTimeout("tryReconnect");
      ws = null;
      setCurrentState("closed");
    }
  };
  let tryReconnect;
  const connect = () => {
    const webSocket = thirdWebsocketArgument ?
    // @ts-expect-error third argument for react-native

    new WebSocket(url, protocols, thirdWebsocketArgument) : new WebSocket(url, protocols);
    ws = webSocket;
    clearInternalTimeout("maxConnect");
    setCurrentState("connecting");
    webSocket.addEventListener("open", () => {
      backoff.reset();
      clearInternalTimeout("maxConnect");
    });
    const handleCloseOrError = () => {
      if (currentState === "closed") return;
      if (!tryReconnect) {
        closeWebsocket();
      } else if (document.visibilityState === "hidden") {
        setCurrentState("wait-for-visibility");
      } else {
        tryReconnect();
      }
    };
    webSocket.addEventListener("close", handleCloseOrError);
    webSocket.addEventListener("message", message => {
      if (message.data === "connection-ack") {
        setCurrentState("connected");
      } else {
        onMessage(message);
      }
    });
    webSocket.addEventListener("error", event => {
      if (onError) {
        onError(event);
      } else {
        console.error("ws error", event);
      }
      handleCloseOrError();
    });
  };
  if (reconnection) {
    tryReconnect = () => {
      if (backoff.attempts >= reconnectionAttempts) {
        return;
      }
      if (currentState === "reconnect-scheduled") {
        return;
      }
      setCurrentState("reconnect-scheduled");
      clearInternalTimeout("tryReconnect");
      const delay = backoff.duration();
      timeouts.tryReconnect = setTimeout(() => {
        connect();
      }, delay);
    };
  }
  const visibilityChangeHandler = !tryReconnect ? undefined : () => {
    if (document.visibilityState === "hidden") {
      if (currentState === "reconnect-scheduled") {
        setCurrentState("wait-for-visibility");
        if (timeouts.tryReconnect !== null) {
          clearTimeout(timeouts.tryReconnect);
        }
      }
      return;
    }
    if (currentState !== "wait-for-visibility") return;
    if (tryReconnect) {
      backoff.reset();
      tryReconnect();
    }
  };
  if (visibilityChangeHandler) {
    globalThis.addEventListener("visibilitychange", visibilityChangeHandler);
  }
  return {
    connect,
    close() {
      if (ws) {
        if (currentState === "connected") {
          ws.send("close");
        }
        closeWebsocket();
      }
      if (visibilityChangeHandler) {
        globalThis.removeEventListener("visibilitychange", visibilityChangeHandler);
      }
    },
    isConnected() {
      return isConnected;
    },
    sendMessage(message) {
      if (!ws) throw new Error("Cannot send message");
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

const logger = new Logger("liwi:resources-websocket-client");
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
      executor(resolve, reject);
    });
    this.stop = stop;
    this.cancel = stop;
    // this.changePayload = changePayload;
  }
  then(onfulfilled, onrejected) {
    return this.promise.then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.promise.catch(onrejected);
  }
}

// TODO handle resubscriptions after reconnect (or in useEffect ?)
// TODO handle send before connected
// TODO reject on connection close OR keep promise hang ?

const createSafeError = error => {
  return new ResourcesServerError(error.code, error.message);
};
function createResourcesWebsocketClient({
  url,
  ...options
}) {
  const isSSR = typeof window === "undefined";
  if (isSSR) {
    return {
      connect: () => {},
      close: () => {},
      listenStateChange: () => {
        return () => {};
      },
      send: () => {
        throw new Error("Cannot work on SSR.");
      },
      subscribe: () => {
        throw new Error("Cannot work on SSR.");
      }
    };
  }
  let currentId = 1;
  let currentSubscriptionId = 1;
  const acks = new Map(); // TODO in progress / unsent / sending => find better name
  const subscriptions = new Map();
  if (!url) {
    url = `ws${window.location.protocol === "https:" ? "s" : ""}://${window.location.host}/ws`;
  }
  logger.info("create", {
    url
  });
  const handlers = {
    ack: (id, error, result) => {
      logger.debug("ack", {
        id
      });
      const ack = acks.get(id);
      if (!ack) {
        logger.warn("no ack found", {
          id
        });
      } else if (error) {
        ack.reject(createSafeError(error));
      } else {
        ack.resolve(result);
      }
    },
    subscription: (id, error, result) => {
      logger.debug("subscription", {
        id
      });
      const subscription = subscriptions.get(id);
      if (!subscription) {
        if (id < currentSubscriptionId) {
          logger.warn("subscription previously closed", {
            id
          });
        } else {
          logger.warn("no subscription found", {
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
  const wsClient = createSimpleWebsocketClient({
    ...options,
    url,
    onMessage: event => {
      logger.debug("message", {
        data: event.data
      });
      const [type, id, error, result] = decode(event.data);
      const handler = handlers[type];
      if (handler) {
        handler(id, error, result);
      }
    }
  });
  const sendMessage = (type, id, payload) => {
    wsClient.sendMessage(encode([type, id, payload]));
  };
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
    const error = new Error("Websocket not connected");
    error.name = "NetworkError";
    throw error;
  };
  const resourcesClient = {
    connect: () => {
      logger.debug("connect");
      wsClient.connect();
    },
    close: () => {
      logger.debug("close");
      wsClient.close();
    },
    listenStateChange: wsClient.listenStateChange,
    send: sendThrowNotConnected,
    subscribe: (type, messageWithoutSubscriptionId, callback) => {
      if (isSSR) throw new Error("subscribing is not allowed in SSR");
      const id = currentId++;
      const subscriptionId = currentSubscriptionId++;
      const message = {
        ...messageWithoutSubscriptionId,
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            sendWithAck(type, message).then(resolve, reject);
          }
        },
        stop: () => {
          acks.delete(id);
          subscriptions.delete(subscriptionId);
          // TODO what if reconnect (backend keeps subscription) and closed at this time ?
          if (wsClient.isConnected()) {
            sendMessage("subscribe:close", null, {
              subscriptionId
            });
          }
        }

        // changePayload: (payload: Payload): Promise<void> => {
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
    logger.info("newState", {
      newState
    });
    if (newState === "connected") {
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
      if (newState === "closed") {
        subscriptions.forEach(subscription => {
          subscription.reject(new Error("Subscription closed"));
        });
      }
    }
  });
  return resourcesClient;
}

export { createResourcesWebsocketClient as createWebsocketTransportClient };
//# sourceMappingURL=index-node22.mjs.map
