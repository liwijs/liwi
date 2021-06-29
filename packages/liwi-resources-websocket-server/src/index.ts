/* eslint-disable max-lines */
import type http from 'http';
import type net from 'net';
import { encode, decode } from 'extended-json';
import type {
  AckError,
  ToServerMessage,
  ToClientMessage,
  ResourcesServerService,
  SubscriptionCallback,
} from 'liwi-resources-server';
import {
  ResourcesServerError,
  createMessageHandler,
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
  close: () => void;
}

const logger = new Logger('liwi:resources-websocket-server');

export const createWsServer = <AuthenticatedUser>(
  server: http.Server,
  path = '/ws',
  resourcesServerService: ResourcesServerService,
  getAuthenticatedUser: GetAuthenticatedUser<AuthenticatedUser>,
): ResourcesWebsocketServer => {
  const wss = new WebSocket.Server({ noServer: true });

  wss.on(
    'connection',
    (ws: ExtendedWebSocket, authenticatedUser: AuthenticatedUser | null) => {
      ws.isAlive = true;

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

        logger.error(error);

        return {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal Server Error',
        };
      };

      const sendAck = (id: number, error: null | Error, result?: any): void => {
        sendMessage('ack', id, error && createSafeError(error), result);
      };

      const sendSubscriptionMessage: SubscriptionCallback = (
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

      const { messageHandler, close } = createMessageHandler(
        resourcesServerService,
        authenticatedUser,
        true,
      );

      const handleDecodedMessage = (
        message: ToServerMessage,
      ): Promise<void> => {
        if (message.id == null) {
          return messageHandler(
            message,
            sendSubscriptionMessage,
          ).then(() => {});
        } else {
          return messageHandler(message, sendSubscriptionMessage)
            .then((result) => {
              sendAck(message.id, null, result);
            })
            .catch((err) => {
              sendAck(message.id, err);
            });
        }
      };

      ws.on('pong', () => {
        ws.isAlive = true;
      });

      ws.on('close', () => {
        close();
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
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          handleDecodedMessage({ type, id, payload } as ToServerMessage);
        } catch {
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

      if (!extWs.isAlive) {
        ws.terminate();
        return;
      }

      extWs.isAlive = false;
      ws.ping(null, undefined);
    });
  }, 60 * 1000);

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
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      authenticatedUserPromise
        .catch((err) => {
          logger.warn(
            'getAuthenticatedUser threw an error, return null instead.',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
