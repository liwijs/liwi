import type { ExtendedJsonValue } from "extended-json";
import type { ToServerSimpleMessages, ToServerSubscribeMessages } from "liwi-resources";
export type TransportClientSubscribeCallback<Result = ExtendedJsonValue> = (err: Error | null, result: Result) => unknown;
export interface TransportClientSubscribeResult<Result, Payload extends Record<string & keyof Payload, ExtendedJsonValue | undefined>> extends PromiseLike<Result> {
    cancel: () => void;
    stop: () => void;
}
export type ConnectionStates = "closed" | "connected" | "connecting" | "opening" | "reconnect-scheduled" | "wait-for-visibility";
export type ConnectionStateChangeListener = (newState: ConnectionStates) => void;
export type ConnectionStateChangeListenerCreator = (listener: ConnectionStateChangeListener) => () => void;
export interface TransportClient {
    connect: () => void;
    close: () => void;
    listenStateChange: ConnectionStateChangeListenerCreator;
    send: <T extends keyof ToServerSimpleMessages, U extends ToServerSimpleMessages[T][1] = ToServerSimpleMessages[T][1]>(type: T, message: ToServerSimpleMessages[T][0]) => Promise<U>;
    subscribe: <T extends keyof ToServerSubscribeMessages<Payload>, Payload extends Record<string & keyof Payload, ExtendedJsonValue>, Result, V extends ToServerSubscribeMessages<Payload>[T][2]>(type: T, message: Omit<ToServerSubscribeMessages<Payload, Result>[T][0], "subscriptionId">, callback: TransportClientSubscribeCallback<V>) => TransportClientSubscribeResult<Result, Payload>;
}
//# sourceMappingURL=TransportClient.d.ts.map