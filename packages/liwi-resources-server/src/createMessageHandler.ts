/* eslint-disable complexity, max-lines */
import { PRODUCTION } from 'pob-babel';
import type {
  Query,
  QuerySubscription,
  ToServerMessage,
  ToServerSubscribeQueryPayload,
  ToServerQueryPayload,
} from 'liwi-resources';
import { ResourcesServerError } from 'liwi-resources';
import Logger from 'nightingale-logger';
import type { ResourcesServerService } from './ResourcesServerService';
import type { ServiceResource, SubscribeHook } from './ServiceResource';

const logger = new Logger('liwi:resources-websocket-client');

export type SubscriptionCallback = (
  subscriptionId: number,
  error: null | Error,
  result: any,
) => void;

export type MessageHandler = (
  message: ToServerMessage,
  subscriptionCallback: SubscriptionCallback,
) => Promise<unknown>;

export interface SubscriptionAndSubscribeHook {
  subscription: QuerySubscription;
  subscribeHook?: SubscribeHook<any>;
  params?: any;
}

const logUnexpectedError = (
  error: Error,
  message: string,
  payload: any,
): void => {
  if (!PRODUCTION || !(error instanceof ResourcesServerError)) {
    logger.error(message, {
      error,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      payload: PRODUCTION ? 'redacted' : payload,
    });
  }
};

export const createMessageHandler = <AuthenticatedUser>(
  resourcesServerService: ResourcesServerService,
  authenticatedUser: AuthenticatedUser | null,
  allowSubscriptions: boolean,
): {
  messageHandler: MessageHandler;
  close: () => void;
} => {
  const openedSubscriptions = allowSubscriptions
    ? new Map<number, SubscriptionAndSubscribeHook>()
    : null;

  const getResource = (payload: {
    resourceName: string;
  }): ServiceResource<any, any> => {
    logger.debug('resource', {
      resourceName: payload.resourceName,
    });
    const resource = resourcesServerService.getServiceResource(
      payload.resourceName,
    );
    return resource;
  };

  const createQuery = (
    payload: ToServerQueryPayload,
    resource: ServiceResource<any, any>,
  ): Query<any, any> => {
    if (!payload.key.startsWith('query')) {
      throw new Error('Invalid query key');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return resource.queries[payload.key](payload.params, authenticatedUser);
  };

  const createSubscription = (
    type: 'fetchAndSubscribe' | 'subscribe',
    payload: ToServerSubscribeQueryPayload,
    resource: ServiceResource<any, any>,
    query: Query<any, any>,
    sendSubscriptionMessage: SubscriptionCallback,
  ): PromiseLike<null> => {
    if (!openedSubscriptions) {
      throw new Error('Subscriptions not allowed');
    }

    const { subscriptionId } = payload;
    if (openedSubscriptions.has(subscriptionId)) {
      const error = 'Already have a watcher for this id. Cannot add a new one';
      logger.warn(error, { subscriptionId, key: payload.key });
      throw new ResourcesServerError('ALREADY_HAVE_WATCHER', error);
    }

    const subscription = query[type]((error: Error | null, result: any) => {
      if (error) {
        logUnexpectedError(error, type, payload);
      }
      sendSubscriptionMessage(subscriptionId, error, result);
    });

    const subscribeHook = resource.subscribeHooks?.[payload.key];
    openedSubscriptions.set(subscriptionId, {
      subscription,
      subscribeHook,
      params: subscribeHook ? payload.params : undefined,
    });
    if (subscribeHook) {
      subscribeHook.subscribed(authenticatedUser, payload.params);
    }

    return subscription.then(() => null);
  };

  const unsubscribeSubscription = ({
    subscription,
    subscribeHook,
    params,
  }: SubscriptionAndSubscribeHook): void => {
    subscription.stop();
    if (subscribeHook) {
      subscribeHook.unsubscribed(authenticatedUser, params);
    }
  };

  return {
    close: () => {
      if (openedSubscriptions) {
        openedSubscriptions.forEach(unsubscribeSubscription);
      }
    },
    messageHandler: async (message, subscriptionCallback): Promise<unknown> => {
      switch (message.type) {
        case 'fetch': {
          try {
            const resource = getResource(message.payload);
            const query = createQuery(message.payload, resource);
            return await query.fetch((result) => result);
          } catch (err) {
            logUnexpectedError(err, message.type, message.payload);
            throw err;
          }
          return;
        }
        case 'fetchAndSubscribe': {
          try {
            const resource = getResource(message.payload);
            const query = createQuery(message.payload, resource);

            return await createSubscription(
              'fetchAndSubscribe',
              message.payload,
              resource,
              query,
              subscriptionCallback,
            );
          } catch (err) {
            logUnexpectedError(err, message.type, message.payload);
            throw err;
          }
          return;
        }
        case 'subscribe': {
          try {
            const resource = getResource(message.payload);
            const query = createQuery(message.payload, resource);
            await createSubscription(
              'subscribe',
              message.payload,
              resource,
              query,
              subscriptionCallback,
            );
          } catch (err) {
            logUnexpectedError(err, message.type, message.payload);
            throw err;
          }
          return;
        }
        // case 'subscribe:changePayload': {
        //   break;
        // }
        case 'subscribe:close': {
          if (!openedSubscriptions) {
            throw new Error('Subscriptions not allowed');
          }
          try {
            const { subscriptionId } = message.payload;
            const SubscriptionAndSubscribeHook = openedSubscriptions.get(
              subscriptionId,
            );
            if (!SubscriptionAndSubscribeHook) {
              logger.warn('tried to unsubscribe non existing watcher', {
                subscriptionId,
              });
            } else {
              openedSubscriptions.delete(subscriptionId);
              unsubscribeSubscription(SubscriptionAndSubscribeHook);
            }
          } catch (err) {
            logUnexpectedError(err, message.type, message.payload);
          }
          return;
        }
        case 'do': {
          try {
            const resource = getResource(message.payload);
            const { operationKey, params } = message.payload;

            const operation = resource.operations[operationKey];

            if (!operation) {
              throw new ResourcesServerError(
                'OPERATION_NOT_FOUND',
                `Operation not found: ${operationKey}`,
              );
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return await operation(params, authenticatedUser);
          } catch (err) {
            logUnexpectedError(err, message.type, message.payload);
            throw err;
          }
        }
      }
    },
  };
};
