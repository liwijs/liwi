/* eslint-disable complexity, max-lines */
import http from 'http';
import net from 'net';
import { PRODUCTION } from 'pob-babel';
import { encode, decode } from 'extended-json';
import {
  AckError,
  Query,
  QuerySubscription,
  SubscribeHook,
  ToServerMessage,
  ToClientMessage,
  ToServerQueryPayload,
  ToServerSubscribeQueryPayload,
  ResourcesServerService,
  ServiceResource,
  ResourcesServerError,
} from 'liwi-resources-server';
import Logger from 'nightingale-logger';
import WebSocket from 'ws';

export type WebsocketServer = WebSocket.Server;

type GetAuthenticatedUser<AuthenticatedUser> = (
  request: http.IncomingMessage,
) => AuthenticatedUser | null | Promise<AuthenticatedUser | null>;

interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
}

export interface ResourcesWebsocketServer {
  wss: WebSocket.Server;
  close(): void;
}

interface SubscriptionAndSubscribeHook {
  subscription: QuerySubscription;
  subscribeHook?: SubscribeHook<any>;
  params?: any;
}

const logger = new Logger('liwi:resources-websocket-client');

export const createWsServer = <AuthenticatedUser>(
  server: http.Server,
  path = '/ws',
  resourcesServerService: ResourcesServerService,
  getAuthenticatedUser: GetAuthenticatedUser<AuthenticatedUser>,
): ResourcesWebsocketServer => {
  const wss = new WebSocket.Server({ noServer: true });

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
    authenticatedUser: AuthenticatedUser | null,
  ): Query<any, any> => {
    if (!payload.key.startsWith('query')) {
      throw new Error('Invalid query key');
    }

    return resource.queries[payload.key](payload.params, authenticatedUser);
  };

  wss.on(
    'connection',
    (ws: ExtendedWebSocket, authenticatedUser: AuthenticatedUser | null) => {
      ws.isAlive = true;
      const openSubscriptions = new Map<number, SubscriptionAndSubscribeHook>();

      const sendMessage = (
        type: ToClientMessage[0],
        id: ToClientMessage[1],
        error: ToClientMessage[2],
        result: ToClientMessage[3],
      ): void => {
        if (!id) throw new Error('Invalid id');
        logger.debug('sendMessage', { type, id, error, result });
        ws.send(encode([type, id, error, result]));
      };

      const createSafeError = (error: Error): AckError => {
        if (error instanceof ResourcesServerError) {
          return { code: error.code, message: error.message };
        }
        return {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal Server Error',
        };
      };

      const sendAck = (id: number, error: null | Error, result?: any): void => {
        sendMessage('ack', id, error && createSafeError(error), result);
      };

      const logUnexpectedError = (
        error: Error,
        message: string,
        payload: any,
      ): void => {
        if (!PRODUCTION || !(error instanceof ResourcesServerError)) {
          logger.error(message, {
            error,
            payload: PRODUCTION ? 'redacted' : payload,
          });
        }
      };

      const logUnexpectedErrorAndSendAck = (
        message: ToServerMessage,
        error: Error,
      ): void => {
        logUnexpectedError(error, message.type, message.payload);
        sendAck(message.id, error);
      };

      const sendSubscriptionMessage = (
        subscriptionId: number,
        error: null | Error,
        result: any,
      ): void => {
        sendMessage(
          'subscription',
          subscriptionId,
          error && createSafeError(error),
          result,
        );
      };

      const createSubscription = (
        type: 'fetchAndSubscribe' | 'subscribe',
        id: number,
        payload: ToServerSubscribeQueryPayload,
        resource: ServiceResource<any, any>,
        query: Query<any, any>,
      ): void => {
        const { subscriptionId } = payload;
        if (openSubscriptions.has(subscriptionId)) {
          const error =
            'Already have a watcher for this id. Cannot add a new one';
          logger.warn(error, { subscriptionId, key: payload.key });
          throw new ResourcesServerError('ALREADY_HAVE_WATCHER', error);
        }

        const subscription = query[type]((error: Error | null, result: any) => {
          if (error) {
            logUnexpectedError(error, type, payload);
          }
          sendSubscriptionMessage(subscriptionId, error, result);
        });

        subscription.then(
          () => sendAck(id, null),
          (err: Error) => {
            logger.error(type, { err });
            sendAck(id, err);
          },
        );

        const subscribeHook =
          resource.subscribeHooks && resource.subscribeHooks[payload.key];
        openSubscriptions.set(subscriptionId, {
          subscription,
          subscribeHook,
          params: subscribeHook ? payload.params : undefined,
        });
        if (subscribeHook) {
          subscribeHook.subscribed(authenticatedUser, payload.params);
        }
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

      const handleDecodedMessage = async (
        message: ToServerMessage,
      ): Promise<void> => {
        switch (message.type) {
          case 'fetch': {
            try {
              const resource = getResource(message.payload);
              const query = createQuery(
                message.payload,
                resource,
                authenticatedUser,
              );
              await query.fetch((result: any) =>
                sendAck(message.id, null, result),
              );
            } catch (err) {
              logUnexpectedErrorAndSendAck(message, err);
            }
            break;
          }
          case 'fetchAndSubscribe': {
            try {
              const resource = getResource(message.payload);
              const query = createQuery(
                message.payload,
                resource,
                authenticatedUser,
              );
              createSubscription(
                'fetchAndSubscribe',
                message.id,
                message.payload,
                resource,
                query,
              );
            } catch (err) {
              logUnexpectedErrorAndSendAck(message, err);
            }
            break;
          }
          case 'subscribe': {
            try {
              const resource = getResource(message.payload);
              const query = createQuery(
                message.payload,
                resource,
                authenticatedUser,
              );
              createSubscription(
                'subscribe',
                message.id,
                message.payload,
                resource,
                query,
              );
            } catch (err) {
              logUnexpectedErrorAndSendAck(message, err);
            }
            break;
          }
          // case 'subscribe:changePayload': {
          //   break;
          // }
          case 'subscribe:close': {
            try {
              const { subscriptionId } = message.payload;
              const SubscriptionAndSubscribeHook = openSubscriptions.get(
                subscriptionId,
              );
              if (!SubscriptionAndSubscribeHook) {
                logger.warn('tried to unsubscribe non existing watcher', {
                  subscriptionId,
                });
              } else {
                openSubscriptions.delete(subscriptionId);
                unsubscribeSubscription(SubscriptionAndSubscribeHook);
              }
            } catch (err) {
              logUnexpectedError(err, message.type, message.payload);
            }
            break;
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

              operation(params, authenticatedUser).then(
                (result: any) => sendAck(message.id, null, result),
                (err: Error) => {
                  logUnexpectedErrorAndSendAck(message, err);
                },
              );
            } catch (err) {
              logUnexpectedErrorAndSendAck(message, err);
            }
            break;
          }
        }
      };

      ws.on('pong', () => {
        ws.isAlive = true;
      });

      ws.on('close', () => {
        openSubscriptions.forEach(unsubscribeSubscription);
      });

      ws.on('message', (message: string): void => {
        if (message === 'close') return;

        if (typeof message !== 'string') {
          logger.warn('got non string message');
          return;
        }

        const decoded = decode<
          [
            ToServerMessage['type'],
            ToServerMessage['id'],
            ToServerMessage['payload'],
          ]
        >(message);
        try {
          const [type, id, payload] = decoded;
          logger.debug('received', { type, id, payload });
          handleDecodedMessage({ type, id, payload } as ToServerMessage);
        } catch (err) {
          logger.notice('invalid message', { decoded });
        }
      });

      ws.send('connection-ack');
    },
  );

  // https://www.npmjs.com/package/ws#how-to-detect-and-close-broken-connections
  const interval = setInterval(() => {
    wss.clients.forEach((ws: WebSocket) => {
      const extWs = ws as ExtendedWebSocket;

      if (!extWs.isAlive) return ws.terminate();

      extWs.isAlive = false;
      ws.ping(null, undefined);
    });
  }, 60000);

  const handleUpgrade = (
    request: http.IncomingMessage,
    socket: net.Socket,
    upgradeHead: Buffer,
  ): void => {
    if (request.url !== path) return;

    const authenticatedUserPromise: Promise<AuthenticatedUser | null> = Promise.resolve(
      getAuthenticatedUser(request),
    );
    wss.handleUpgrade(request, socket, upgradeHead, (ws) => {
      authenticatedUserPromise
        .catch((err) => {
          logger.warn(
            'getAuthenticatedUser threw an error, return null instead.',
            { err },
          );
          return null;
        })
        .then((authenticatedUser) => {
          wss.emit('connection', ws, authenticatedUser);
        });
    });
  };

  server.on('upgrade', handleUpgrade);

  return {
    wss,
    close(): void {
      wss.close();
      server.removeListener('upgrade', handleUpgrade);
      clearInterval(interval);
    },
  };
};
