/* eslint-disable complexity */
// import { PRODUCTION } from 'pob-babel';
// eslint-disable-next-line import/no-unresolved, import/extensions
import { Server, Socket } from 'socket.io';
import { ResourcesServerService } from 'liwi-resources-server';
import Logger from 'nightingale-logger';
import { encode, decode } from 'extended-json';
import { ResourceOperationKey } from 'liwi-types';

const logger = new Logger('liwi:rest-websocket');

type Callback = (err: null | string, result?: string | undefined) => void;

declare module 'socket.io' {
  interface Socket {
    // user added in alp-auth
    user?: any;
  }
}

interface EventResourceParams {
  type: ResourceOperationKey;
  json: string;
  resourceName: string;
}

export default function init(
  io: Server,
  resourcesService: ResourcesServerService,
) {
  io.on('connection', (socket: Socket) => {
    const openWatchers = new Set();

    socket.on('disconnect', () => {
      openWatchers.forEach((watcher) => watcher.stop());
    });

    socket.on(
      'resource',
      (
        { type, resourceName, json }: EventResourceParams,
        callback: Callback,
      ): void => {
        try {
          const value = json && decode(json);

          switch (type) {
            case 'cursor toArray': {
              const resource = resourcesService.getCursorResource(resourceName);
              resourcesService
                .createCursor(resource, socket.user, value)
                .then((cursor) => cursor.toArray())
                .then((results) => callback(null, encode(results)))
                .catch((err) => {
                  logger.error(type, err);
                  callback(err.message);
                });
              break;
            }

            case 'fetch':
            case 'subscribe':
            case 'fetchAndSubscribe':
              try {
                const resource = resourcesService.getServiceResource(
                  resourceName,
                );
                logger.info('resource', { type, resourceName, value });

                const [key, params, eventName] = value;

                if (!key.startsWith('query')) {
                  throw new Error('Invalid query key');
                }

                const query = resource.queries[key](params, socket.user);

                if (type === 'fetch') {
                  query
                    .fetch((result: any) =>
                      callback(null, result && encode(result)),
                    )
                    .catch((err: any) => {
                      logger.error(type, { err });
                      callback(err.message || err);
                    });
                } else {
                  const watcher = query[type](
                    (err: Error | null, result: any) => {
                      if (err) {
                        logger.error(type, { err });
                      }

                      socket.emit(eventName, err, result && encode(result));
                    },
                  );
                  watcher.then(
                    () => callback(null),
                    (err: Error) => {
                      logger.error(type, { err });
                      callback(err.message);
                    },
                  );

                  openWatchers.add(watcher);
                }
              } catch (err) {
                logger.error(type, { err });
                callback(err.message || err);
              }
              break;

            case 'do': {
              try {
                const resource = resourcesService.getServiceResource(
                  resourceName,
                );
                logger.info('resource', { type, resourceName, value });

                const [key, params] = value;

                const operation = resource.operations[key];

                if (!operation) {
                  throw new Error('Operation not found');
                }

                operation(params, socket.user).then(
                  (result) => callback(null, result),
                  (err: Error) => {
                    logger.error(type, { err });
                    callback(err.message);
                  },
                );
              } catch (err) {
                logger.error(type, { err });
                callback(err.message || err);
              }
              break;
            }

            default:
              try {
                logger.warn('Unknown command', { type });
                callback(`rest: unknown command "${type}"`);
              } catch (err) {
                logger.error(type, { err });
                callback(err.message || err);
              }
          }
        } catch (err) {
          logger.warn('rest error', { err });
          callback(err.message || err);
        }
      },
    );
  });
}
