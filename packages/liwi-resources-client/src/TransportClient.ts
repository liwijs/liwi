import { ExtendedJsonValue } from 'extended-json';
import {
  ToServerSimpleMessages,
  ToServerSubscribeMessages,
} from 'liwi-resources';

export type TransportClientSubscribeCallback<Result = ExtendedJsonValue> = (
  err: Error | null,
  result: Result,
) => unknown;

export interface TransportClientSubscribeResult<
  Result,
  Payload extends Record<keyof Payload & string, ExtendedJsonValue | undefined>
> extends PromiseLike<Result> {
  cancel: () => void;
  stop: () => void;
  // changePayload: (payload: Payload) => Promise<void>;
}

export type ConnectionStates =
  | 'closed'
  | 'opening'
  | 'connecting'
  | 'connected'
  | 'reconnecting';

export type ConnectionStateChangeListener = (
  newState: ConnectionStates,
) => void;

export type ConnectionStateChangeListenerCreator = (
  listener: ConnectionStateChangeListener,
) => () => void;

export interface TransportClient {
  connect(): void;
  close(): void;
  listenStateChange: ConnectionStateChangeListenerCreator;

  send<
    T extends keyof ToServerSimpleMessages,
    U extends ToServerSimpleMessages[T][1] = ToServerSimpleMessages[T][1]
  >(
    type: T,
    message: ToServerSimpleMessages[T][0],
  ): Promise<U>;

  subscribe<
    T extends keyof ToServerSubscribeMessages<Payload>,
    Payload extends Record<keyof Payload & string, ExtendedJsonValue>,
    Result,
    V extends ToServerSubscribeMessages<Payload>[T][2]
  >(
    type: T,
    message: Omit<
      ToServerSubscribeMessages<Payload, Result>[T][0],
      'subscriptionId'
    >,
    callback: TransportClientSubscribeCallback<V>,
  ): TransportClientSubscribeResult<Result, Payload>;
}
