import type { ConnectionStates } from 'liwi-resources-client';
export type StateChangeListener = (newState: ConnectionStates) => void;
export type StateChangeListenerCreator = (listener: StateChangeListener) => () => void;
export interface SimpleWebsocketClientOptions {
    url: string;
    protocols?: string | string[];
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
type Message = Parameters<WebSocket['send']>[0];
export interface WebsocketTransport {
    connect: () => void;
    close: () => void;
    isConnected: () => boolean;
    sendMessage: (message: Message) => void;
    listenStateChange: StateChangeListenerCreator;
}
export default function createSimpleWebsocketClient({ url, protocols, reconnection, reconnectionDelayMin, reconnectionDelayMax, reconnectionAttempts, thirdWebsocketArgument, onMessage, onError, }: SimpleWebsocketClientOptions): WebsocketTransport;
export {};
//# sourceMappingURL=createSimpleWebsocketClient.d.ts.map