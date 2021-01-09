import type { ConnectionStates } from 'liwi-resources-client';
export declare type StateChangeListener = (newState: ConnectionStates) => void;
export declare type StateChangeListenerCreator = (listener: StateChangeListener) => () => void;
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
    onError?: (event: Event) => void;
}
declare type Message = Parameters<WebSocket['send']>[0];
export interface WebsocketTransport {
    connect: () => void;
    close: () => void;
    isConnected: () => boolean;
    sendMessage: (message: Message) => void;
    listenStateChange: StateChangeListenerCreator;
}
export default function createSimpleWebsocketClient({ url, protocols, reconnection, reconnectionDelayMin, reconnectionDelayMax, reconnectionAttempts, onMessage, onError, }: SimpleWebsocketClientOptions): WebsocketTransport;
export {};
//# sourceMappingURL=createSimpleWebsocketClient.d.ts.map