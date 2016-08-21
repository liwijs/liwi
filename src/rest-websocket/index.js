/* global PRODUCTION */

import Logger from 'nightingale-logger';

const logger = new Logger('liwi.rest-websocket');

export default function init(io, restService) {
  io.on('connection', socket => {
    socket.on('rest', (
      { type, restName }: { type: string, restName: string },
      args: Array,
      callback: Function,
    ) => {
      logger.info('rest', { type, restName, args });
      switch (type) {
        case 'cursor toArray': {
          const [options] = args;
          return restService.createCursor(restName, socket.user, options)
                        .then(cursor => cursor.toArray())
                        .then(results => callback(null, results))
                        .catch(err => {
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
              throw new Error(`${restName}.${type} is not available`);
            }

            return restResource[type](socket.user, ...args)
                            .then(result => callback(null, result))
                            .catch(err => {
                              logger.error(type, { err });
                              callback(err.message || err);
                            });
          } catch (err) {
            logger.error(type, { err });
            callback(err.message || err);
          }
          break;

        default:
          logger.warn('Unknown command', { type });
          callback(`Unknown command: "${type}"`);
      }
    });
  });
}
