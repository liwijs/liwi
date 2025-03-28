import Backoff from "backo2";
import type { ConnectionStates } from "liwi-resources-client";

export type StateChangeListener = (newState: ConnectionStates) => void;

export type StateChangeListenerCreator = (
  listener: StateChangeListener,
) => () => void;

export interface SimpleWebsocketClientOptions {
  url: string;
  protocols?: string[] | string;
  timeout?: number;
  reconnection?: boolean;
  reconnectionDelayMin?: number;
  reconnectionDelayMax?: number;
  reconnectionAttempts?: number;
  inactivityTimeout?: number;
  thirdWebsocketArgument?: unknown;
  onMessage: (message: MessageEvent) => void;
  onError?: (event: Event) => void;
}

type Message = Parameters<WebSocket["send"]>[0];

export interface WebsocketTransport {
  connect: () => void;
  close: () => void;
  isConnected: () => boolean;
  sendMessage: (message: Message) => void;
  listenStateChange: StateChangeListenerCreator;
}

type Timeouts = "inactivity" | "maxConnect" | "tryReconnect";

export default function createSimpleWebsocketClient({
  url,
  protocols,
  reconnection = true,
  reconnectionDelayMin = 1000,
  reconnectionDelayMax = 30 * 1000,
  reconnectionAttempts = Infinity,
  thirdWebsocketArgument,
  onMessage,
  onError,
}: SimpleWebsocketClientOptions): WebsocketTransport {
  let ws: WebSocket | null = null;
  let currentState: ConnectionStates = "closed";
  let isConnected = false;
  const stateChangeListeners = new Set<StateChangeListener>();

  const backoff = new Backoff({
    min: reconnectionDelayMin,
    max: reconnectionDelayMax,
    factor: 1.2,
  });

  const timeouts: Record<Timeouts, ReturnType<typeof setTimeout> | null> = {
    maxConnect: null,
    tryReconnect: null,
    inactivity: null,
  };

  const setCurrentState = (newState: ConnectionStates): void => {
    if (currentState === newState) return;
    currentState = newState;
    isConnected = currentState === "connected";
    stateChangeListeners.forEach((listener) => {
      listener(newState);
    });
  };

  const clearInternalTimeout = (timeoutKey: Timeouts): void => {
    const timeout = timeouts[timeoutKey];
    if (timeout) {
      clearTimeout(timeout);
      timeouts[timeoutKey] = null;
    }
  };

  const closeWebsocket = (): void => {
    clearInternalTimeout("inactivity");
    if (ws) {
      clearInternalTimeout("maxConnect");
      clearInternalTimeout("tryReconnect");
      ws = null;
      setCurrentState("closed");
    }
  };

  let tryReconnect: (() => void) | undefined;

  const connect = (): void => {
    const webSocket = thirdWebsocketArgument
      ? // @ts-expect-error third argument for react-native

        new WebSocket(url, protocols, thirdWebsocketArgument)
      : new WebSocket(url, protocols);
    ws = webSocket;
    clearInternalTimeout("maxConnect");
    setCurrentState("connecting");

    webSocket.addEventListener("open", (): void => {
      backoff.reset();
      clearInternalTimeout("maxConnect");
    });

    const handleCloseOrError = (): void => {
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

    webSocket.addEventListener("message", (message): void => {
      if (message.data === "connection-ack") {
        setCurrentState("connected");
      } else {
        onMessage(message);
      }
    });

    webSocket.addEventListener("error", (event): void => {
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

  const visibilityChangeHandler: (() => void) | undefined = !tryReconnect
    ? undefined
    : () => {
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
  const wsTransport: WebsocketTransport = {
    connect,

    close() {
      if (ws) {
        if (currentState === "connected") {
          ws.send("close");
        }
        closeWebsocket();
      }
      if (visibilityChangeHandler) {
        globalThis.removeEventListener(
          "visibilitychange",
          visibilityChangeHandler,
        );
      }
    },

    isConnected() {
      return isConnected;
    },

    sendMessage(message): void {
      if (!ws) throw new Error("Cannot send message");
      ws.send(message);
    },

    listenStateChange: (listener) => {
      stateChangeListeners.add(listener);
      return (): void => {
        stateChangeListeners.delete(listener);
      };
    },
  };

  return wsTransport;
}
