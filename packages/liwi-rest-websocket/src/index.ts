/* eslint-disable complexity */
import { PRODUCTION } from 'pob-babel';
// eslint-disable-next-line import/no-unresolved, import/extensions
import { Server, Socket } from 'socket.io';
import { RestService } from 'liwi-rest';
import Logger from 'nightingale-logger';
import { encode, decode } from 'extended-json';

const logger = new Logger('liwi:rest-websocket');

type Callback = (err: null | string, result?: string | undefined) => void;

declare module 'socket.io' {
  interface Socket {
    // user added in alp-auth
    user: any;
  }
}

export default function init(io: Server, restService: RestService) {
  io.on('connection', (socket: Socket) => {
    const openWatchers = new Set();

    socket.on('disconnect', () => {
      openWatchers.forEach((watcher) => watcher.stop());
    });

    socket.on(
      'rest',
      (
        {
          type,
          restName,
          json,
        }: { json: string; restName: string; type: string },
        callback: Callback,
      ) => {
        try {
          const args = decode(json);
          if (!Array.isArray(args)) {
            logger.debug('args', { args });

            if (callback) {
              throw new Error('Invalid args');
            }
          }

          const restResource = restService.get(restName);

          logger.info('rest', { type, restName, args });
          switch (type) {
            case 'cursor toArray': {
              const [options] = args as Array<any>;
              return restService
                .createCursor(restResource, socket.user, options)
                .then((cursor) => cursor.toArray())
                .then((results) => callback(null, encode(results)))
                .catch((err) => {
                  logger.error(type, err);
                  callback(err.message);
                });
            }

            case 'insertOne':
            case 'replaceOne':
            case 'upsertOne':
            case 'partialUpdateByKey':
            case 'partialUpdateOne':
            case 'partialUpdateMany':
            case 'deleteByKey':
            case 'deleteOne':
            case 'findOne':
              try {
                if (!PRODUCTION && !restResource[type]) {
                  throw new Error(`rest: ${restName}.${type} is not available`);
                }

                // eslint-disable-next-line prettier/prettier
                return restResource[type](socket.user, ...args)
                  .then((result: any) => callback(null, encode(result)))
                  .catch((err: Error) => {
                    logger.error(type, { err });
                    callback(err.message);
                  });
              } catch (err) {
                logger.error(type, { err });
                callback(err.message || err);
              }
              break;

            case 'fetch':
            case 'subscribe':
            case 'fetchAndSubscribe':
              try {
                const [key, eventName, otherArgs = []] = args;

                if (!key.startsWith('query')) {
                  throw new Error('Invalid query key');
                }

                const query = restResource.queries[key]; // todo pass connected user
                if (!query) {
                  throw new Error(
                    `rest: ${restName}.${type}.${key} is not available`,
                  );
                }

                if (type === 'fetch') {
                  return query[type](
                    (result: any) => callback(null, result && encode(result)),
                    ...otherArgs,
                  ).catch((err: any) => {
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
