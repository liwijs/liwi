import { ExtendedJsonValue } from 'extended-json';
import { ToServerSimpleMessages, ToServerSubscribeMessages } from 'liwi-resources';
export declare type TransportClientSubscribeCallback<Result = ExtendedJsonValue> = (err: Error | null, result: Result) => unknown;
export interface TransportClientSubscribeResult<Result, Payload extends Record<keyof Payload & string, ExtendedJsonValue | undefined>> extends PromiseLike<Result> {
    cancel: () => void;
    stop: () => void;
}
export declare type ConnectionStates = 'closed' | 'opening' | 'connecting' | 'connected' | 'reconnect-scheduled' | 'wait-for-visibility';
export declare type ConnectionStateChangeListener = (newState: ConnectionStates) => void;
export declare type ConnectionStateChangeListenerCreator = (listener: ConnectionStateChangeListener) => () => void;
export interface TransportClient {
    connect(): void;
    close(): void;
    listenStateChange: ConnectionStateChangeListenerCreator;
    send<T extends keyof ToServerSimpleMessages, U extends ToServerSimpleMessages[T][1] = ToServerSimpleMessages[T][1]>(type: T, message: ToServerSimpleMessages[T][0]): Promise<U>;
    subscribe<T extends keyof ToServerSubscribeMessages<Payload>, Payload extends Record<keyof Payload & string, ExtendedJsonValue>, Result, V extends ToServerSubscribeMessages<Payload>[T][2]>(type: T, message: Omit<ToServerSubscribeMessages<Payload, Result>[T][0], 'subscriptionId'>, callback: TransportClientSubscribeCallback<V>): TransportClientSubscribeResult<Result, Payload>;
}
//# sourceMappingURL=TransportClient.d.ts.map