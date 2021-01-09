/* eslint-disable max-lines */
import type { ExtendedJsonValue } from 'extended-json';
import { encode, decode } from 'extended-json';
import { ResourcesServerError } from 'liwi-resources-client';
import type {
  TransportClient,
  TransportClientSubscribeCallback,
  TransportClientSubscribeResult,
  ToClientMessage,
  ToServerMessages,
  ToServerSubscribeMessages,
  AckError,
} from 'liwi-resources-client';
import Logger from 'nightingale-logger';
import type { SimpleWebsocketClientOptions } from './createSimpleWebsocketClient';
import createSimpleWebsocketClient from './createSimpleWebsocketClient';

const logger = new Logger('liwi:resources-websocket-client');

type Resolve<T> = (result: T) => void;
type Reject = (reason?: any) => void;

interface Ack<T> {
  reject: Reject;
  resolve: Resolve<T>;
}

interface Subscription<
  T extends keyof ToServerSubscribeMessages<any>,
  U,
  Message extends { payload: any } = any
> extends Ack<U> {
  type: T;
  message: Message;
  callback: TransportClientSubscribeCallback<U>;
}

export type WebsocketTransportClientOptions = Omit<
  SimpleWebsocketClientOptions,
  'onMessage' | 'url'
> &
  Partial<Pick<SimpleWebsocketClientOptions, 'url'>>;

type PromiseExecutor<T> = (
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void,
) => void;

type Handler<T> = (id: number, error: AckError | null, result: T) => void;

class SubscribeResultPromise<
  Result,
  Payload extends Record<keyof Payload & string, ExtendedJsonValue | undefined>
> implements
    TransportClientSubscribeResult<Result, Payload>,
    PromiseLike<Result> {
  private readonly promise: Promise<Result>;

  readonly stop: TransportClientSubscribeResult<Result, Payload>['stop'];

  readonly cancel: TransportClientSubscribeResult<Result, Payload>['cancel'];

  // readonly changePayload: TransportClientSubscribeResult<
  //   Result,
  //   Payload
  // >['changePayload'];

  constructor({
    executor,
    stop,
  }: {
    executor: PromiseExecutor<Result>;
    stop: TransportClientSubscribeResult<Result, Payload>['stop'];
    // changePayload: TransportClientSubscribeResult<
    //   Result,
    //   Payload
    // >['changePayload'];
  }) {
    this.promise = new Promise<Result>((resolve, reject) => {
      return executor(resolve, reject);
    });
    this.stop = stop;
    this.cancel = stop;
    // this.changePayload = changePayload;
  }

  then<TResult1 = Result, TResult2 = never>(
    onfulfilled?:
      | ((value: Result) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined,
  ): PromiseLike<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch<TResult2 = never>(
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined,
  ): PromiseLike<Result | TResult2> {
    return this.promise.catch(onrejected);
  }
}

// TODO handle resubscriptions after reconnect (or in useEffect ?)
// TODO handle send before connected
// TODO reject on connection close OR keep promise hang ?

const createSafeError = (error: AckError): ResourcesServerError => {
  return new ResourcesServerError(error.code, error.message);
};

export default function createResourcesWebsocketClient({
  url,
  ...options
}: WebsocketTransportClientOptions): TransportClient {
  let currentId = 1;
  let currentSubscriptionId = 1;
  const acks = new Map<number, Ack<any>>(); // TODO in progress / unsent / sending => find better name
  const subscriptions = new Map<number, Subscription<any, any>>();

  if (!url) {
    url = `ws${window.location.protocol === 'https:' ? 's' : ''}://${
      window.location.host
    }/ws`;
  }
  logger.info('create', { url });

  const handlers: Record<ToClientMessage[0], Handler<any>> = {
    ack: (id, error, result) => {
      logger.debug('ack', { id });
      const ack = acks.get(id);
      if (!ack) {
        logger.warn('no ack found', { id });
      } else if (error) {
        ack.reject(createSafeError(error));
      } else {
        ack.resolve(result);
      }
    },
    subscription: (id, error, result) => {
      logger.debug('subscription', { id });
      const subscription = subscriptions.get(id);
      if (!subscription) {
        if (id < currentSubscriptionId) {
          logger.warn('subscription previously closed', { id });
        } else {
          logger.warn('no subscription found', { id });
        }
      } else if (error) {
        subscription.callback(createSafeError(error), null);
      } else {
        subscription.callback(null, result);
      }
    },
  };

  const wsClient = createSimpleWebsocketClient({
    ...options,
    url,
    onMessage: (event) => {
      logger.debug('message', { data: event.data });
      const [type, id, error, result] = decode<ToClientMessage>(event.data);
      const handler = handlers[type];

      if (handler) {
        handler(id, error, result);
      }
    },
  });

  const sendMessage = <T extends keyof ToServerMessages>(
    type: T,
    id: number | null,
    payload: ToServerMessages[T][0],
  ): void => wsClient.sendMessage(encode([type, id, payload as any]));

  const sendWithAck = <T extends keyof ToServerMessages>(
    type: T,
    message: ToServerMessages[T][0],
  ): Promise<ToServerMessages[T][1]> => {
    return new Promise((resolve, reject) => {
      const id = currentId++;
      acks.set(id, {
        resolve: (result) => {
          acks.delete(id);
          resolve(result);
        },
        reject: (err) => {
          acks.delete(id);
          reject(err);
        },
      });
      sendMessage(type, id, message);
    });
  };

  const sendThrowNotConnected = (): never => {
    const error = new Error('Websocket not connected');
    error.name = 'NetworkError';
    throw error;
  };

  const resourcesClient: TransportClient = {
    connect: () => wsClient.connect(),
    close: () => wsClient.close(),
    listenStateChange: wsClient.listenStateChange,
    send: sendThrowNotConnected,

    subscribe: <
      T extends keyof ToServerSubscribeMessages<Payload>,
      Payload extends Record<keyof Payload & string, ExtendedJsonValue>,
      Result,
      V extends ToServerSubscribeMessages<Payload>[T][2]
    >(
      type: T,
      messageWithoutSubscriptionId: Omit<
        ToServerSubscribeMessages<Payload, Result>[T][0],
        'subscriptionId'
      >,
      callback: TransportClientSubscribeCallback<V>,
    ): TransportClientSubscribeResult<Result, Payload> => {
      const id = currentId++;
      const subscriptionId = currentSubscriptionId++;
      const message = { ...messageWithoutSubscriptionId, subscriptionId };

      return new SubscribeResultPromise<Result, Payload>({
        executor: (resolve, reject) => {
          subscriptions.set(subscriptionId, {
            type,
            message,
            resolve,
            reject,
            callback,
          });
          if (wsClient.isConnected()) {
            // TODO reject should remove subscription ?
            sendWithAck(type, message).then(resolve as any, reject);
          }
        },
        stop: (): void => {
          acks.delete(id);
          subscriptions.delete(subscriptionId);
          // TODO what if reconnect (backend keeps subscription) and closed at this time ?
          if (wsClient.isConnected()) {
            sendMessage('subscribe:close', null, { subscriptionId });
          }
        },

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
    },
  };

  wsClient.listenStateChange((newState) => {
    logger.info('newState', { newState });
    if (newState === 'connected') {
      resourcesClient.send = sendWithAck as TransportClient['send'];
      subscriptions.forEach((subscription, subscriptionId) => {
        sendWithAck(subscription.type, subscription.message).then(
          subscription.resolve,
          subscription.reject,
        );
      });
    } else {
      resourcesClient.send = sendThrowNotConnected;
      acks.forEach((ack) => {
        ack.reject(
          new Error(`Failed to get ack, connection state is now ${newState}`),
        );
      });
      acks.clear();

      if (newState === 'closed') {
        subscriptions.forEach((subscription) => {
          subscription.reject(new Error('Subscription closed'));
        });
      }
    }
  });

  return resourcesClient;
}
