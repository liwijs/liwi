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
      ) => {
        try {
          const value = json && decode(json);

          const resource = resourcesService.get(resourceName);

          logger.info('resource', { type, resourceName, value });
          switch (type) {
            case 'cursor toArray': {
              return resourcesService
                .createCursor(resource, socket.user, value)
                .then((cursor) => cursor.toArray())
                .then((results) => callback(null, encode(results)))
                .catch((err) => {
                  logger.error(type, err);
                  callback(err.message);
                });
            }

            case 'fetch':
            case 'subscribe':
            case 'fetchAndSubscribe':
              try {
                const [key, eventName, otherArgs] = value;

                if (!key.startsWith('query')) {
                  throw new Error('Invalid query key');
                }

                const queryOptions = resource.queries[key];
                // TODO resource.criteria(queryOptions.criteria) & co ?
                if (!queryOptions) {
                  throw new Error(
                    `rest: ${resourceName}.${type}.${key} is not available`,
                  );
                }
                const query = resource.store.createQuery(queryOptions); // todo pass connected user

                if (type === 'fetch') {
                  return query
                    .fetch(
                      (result: any) => callback(null, result && encode(result)),
                      ...otherArgs,
                    )
                    .catch((err: any) => {
                      logger.error(type, { err });
                      callback(err.message || err);
                    });
                } else {
                  const watcher = query[type]((err: Error, result: any) => {
                    if (err) {
                      logger.error(type, { err });
                    }

                    socket.emit(eventName, err, result && encode(result));
                  });
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
