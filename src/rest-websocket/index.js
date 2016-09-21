/* global PRODUCTION */
import Logger from 'nightingale-logger';
import { encode, decode } from '../msgpack';

const logger = new Logger('liwi.rest-websocket');

type ObjectBufferType = {
  type: 'Buffer',
  data: Array<number>,
}

export default function init(io, restService) {
  io.on('connection', (socket) => {
    socket.on('rest', (
      { type, restName, buffer }: { type: string, restName: string, buffer: ?ObjectBufferType },
      args: ?Array<any>|Function,
      callback: ?Function,
    ) => {
      if (buffer) {
        if (!PRODUCTION && callback) {
          throw new Error('Cannot have args and buffer.');
        }

        callback = args;
        args = decode(buffer);
        console.log(args);
      }

      if (!PRODUCTION && !callback) {
        throw new Error('`callback` missing.');
      }

      logger.info('rest', { type, restName, args });
      switch (type) {
        case 'cursor toArray': {
          const [options] = args;
          return restService.createCursor(restName, socket.user, options)
            .then(cursor => cursor.toArray())
            .then(results => callback(null, encode(results)))
            .catch((err) => {
              logger.error(type, err);
              callback(err.message);
            });
        }


        case 'insertOne':
        case 'updateOne':
        case 'updateSeveral':
        case 'partialUpdateByKey':
        case 'partialUpdateOne':
        case 'partialUpdateMany':
        case 'deleteByKey':
        case 'deleteOne':
        case 'findOne':
          try {
            const restResource = restService.get(restName);
            if (!PRODUCTION && !restResource[type]) {
              throw new Error(`rest: ${restName}.${type} is not available`);
            }

            return restResource[type](socket.user, ...args)
              .then(result => callback(null, encode(result)))
              .catch((err) => {
                logger.error(type, { err });
                callback(err.message || err);
              });
          } catch (err) {
            logger.error(type, { err });
            callback(err.message || err);
          }
          break;

        case 'query:fetch':
        case 'query:subscribe':
          if (type === 'query:fetch') {
            type = 'fetch';
          }
          if (type === 'query:subscribe') {
            type = 'subscribe';
          }

          try {
            const restResource = restService.get(restName);
            const key = args[0];

            const query = restResource.query(socket.user, ...args);
            if (!query) {
              throw new Error(`rest: ${restName}.${type}.${key} is not available`);
            }

            if (type === 'fetch') {
              return query[type](result => callback(null, encode(result)))
                .catch((err) => {
                  logger.error(type, { err });
                  callback(err.message || err);
                });
            } else {
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
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
    });
  });
}
