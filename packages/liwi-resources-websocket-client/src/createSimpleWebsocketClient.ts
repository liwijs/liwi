/* eslint-disable unicorn/prefer-add-event-listener */
import Backoff from 'backo2';

type States =
  | 'closed'
  | 'opening'
  | 'connecting'
  | 'connected'
  | 'reconnecting';

export type StateChangeListener = (newState: States) => void;

export type StateChangeListenerCreator = (
  listener: StateChangeListener,
) => () => void;

export interface SimpleWebsocketClientOptions {
  url: string;
  protocols?: string | string[];
  timeout?: number;
  reconnection?: boolean;
  reconnectionDelayMin?: number;
  reconnectionDelayMax?: number;
  reconnectionAttempts?: number;
  inactivityTimeout?: number;
  onMessage: (message: MessageEvent) => void;
  onError: (event: Event) => void;
}

type Message = Parameters<WebSocket['send']>[0];

export interface WebsocketTransport {
  connect(): void;
  close(): void;
  isConnected(): boolean;
  sendMessage(message: Message): void;
  listenStateChange: StateChangeListenerCreator;
}

type Timeouts = 'maxConnect' | 'tryReconnect' | 'inactivity';

export default function createSimpleWebsocketClient({
  url,
  protocols,
  reconnection = true,
  reconnectionDelayMin = 1000,
  reconnectionDelayMax = 30000,
  reconnectionAttempts = Infinity,
  onMessage,
  onError,
}: SimpleWebsocketClientOptions): WebsocketTransport {
  let ws: WebSocket | null = null;
  let currentState: States = 'closed';
  let isConnected = false;
  const stateChangeListeners = new Set<StateChangeListener>();

  const backoff = new Backoff({
    min: reconnectionDelayMin,
    max: reconnectionDelayMax,
    factor: 1.2,
  });

  const timeouts: Record<Timeouts, null | ReturnType<typeof setTimeout>> = {
    maxConnect: null,
    tryReconnect: null,
    inactivity: null,
  };

  const setCurrentState = (newState: States): void => {
    if (currentState === newState) return;
    currentState = newState;
    isConnected = currentState === 'connected';
    stateChangeListeners.forEach((listener) => listener(newState));
  };

  const clearInternalTimeout = (timeoutKey: Timeouts): void => {
    const timeout = timeouts[timeoutKey];
    if (timeout) {
      clearTimeout(timeout);
      timeouts[timeoutKey] = null;
    }
  };

  const closeWebsocket = (): void => {
    clearInternalTimeout('inactivity');
    if (ws) {
      clearInternalTimeout('maxConnect');
      clearInternalTimeout('tryReconnect');
      ws = null;
      setCurrentState('closed');
    }
  };

  let tryReconnect: () => void;

  const connect = (): void => {
    setCurrentState('opening');
    const webSocket = new WebSocket(url, protocols);
    ws = webSocket;
    clearInternalTimeout('maxConnect');
    webSocket.onopen = (): void => {
      setCurrentState('connecting');
      clearInternalTimeout('maxConnect');
    };

    webSocket.onclose = (): void => {
      if (currentState !== 'closed') {
        if (tryReconnect) {
          tryReconnect();
        } else {
          closeWebsocket();
        }
      }
    };

    webSocket.onmessage = (message): void => {
      if (message.data === 'connection-ack') {
        setCurrentState('connected');
      } else {
        onMessage(message);
      }
    };

    webSocket.onerror = (event): void => {
      onError(event);
    };
  };

  if (reconnection) {
    tryReconnect = () => {
      if (backoff.attempts >= reconnectionAttempts) {
        return;
      }

      if (currentState === 'reconnecting') {
        return;
      }

      setCurrentState('reconnecting');
      clearInternalTimeout('tryReconnect');
      const delay = backoff.duration();
      timeouts.tryReconnect = setTimeout(() => {
        connect();
      }, delay);
    };
  }

  const wsTransport: WebsocketTransport = {
    connect,

    close() {
      if (ws) {
        if (currentState === 'connected') {
          ws.send('close');
        }
        closeWebsocket();
      }
    },

    isConnected() {
      return isConnected;
    },

    sendMessage(message): void {
      if (!ws) throw new Error('Cannot send message');
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
