'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Logger = _interopDefault(require('nightingale-logger'));
var extendedJson = require('extended-json');

/* eslint-disable complexity */
const logger = new Logger('liwi:rest-websocket');
function init(io, restService) {
  io.on('connection', socket => {
    const openWatchers = new Set();
    socket.on('disconnect', () => {
      openWatchers.forEach(watcher => watcher.stop());
    });
    socket.on('rest', ({
      type,
      restName,
      json
    }, callback) => {
      try {
        const args = extendedJson.decode(json);

        if (!Array.isArray(args)) {
          logger.debug('args', {
            args
          });

          if (callback) {
            throw new Error('Invalid args');
          }
        }

        const restResource = restService.get(restName);
        logger.info('rest', {
          type,
          restName,
          args
        });

        switch (type) {
          case 'cursor toArray':
            {
              const [options] = args;
              return restService.createCursor(restResource, socket.user, options).then(cursor => cursor.toArray()).then(results => callback(null, extendedJson.encode(results))).catch(err => {
                logger.error(type, err);
                callback(err.message);
              });
            }

          case 'insertOne':
          case 'replaceOne':
          case 'replaceSeveral':
          case 'upsertOneWithInfo':
          case 'partialUpdateByKey':
          case 'partialUpdateOne':
          case 'partialUpdateMany':
          case 'deleteByKey':
          case 'deleteMany':
          case 'findOne':
            try {
              // eslint-disable-next-line prettier/prettier
              return restResource[type](socket.user, ...args).then(result => callback(null, extendedJson.encode(result))).catch(err => {
                logger.error(type, {
                  err
                });
                callback(err.message);
              });
            } catch (err) {
              logger.error(type, {
                err
              });
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
                throw new Error(`rest: ${restName}.${type}.${key} is not available`);
              }

              if (type === 'fetch') {
                return query[type](result => callback(null, result && extendedJson.encode(result)), ...otherArgs).catch(err => {
                  logger.error(type, {
                    err
                  });
                  callback(err.message || err);
                });
              } else {
                const watcher = query[type]((err, result) => {
                  if (err) {
                    logger.error(type, {
                      err
                    });
                  }

                  socket.emit(eventName, err, result && extendedJson.encode(result));
                });
                watcher.then(() => callback(null), err => {
                  logger.error(type, {
                    err
                  });
                  callback(err.message);
                });
                openWatchers.add(watcher);
              }
            } catch (err) {
              logger.error(type, {
                err
              });
              callback(err.message || err);
            }

            break;

          default:
            try {
              logger.warn('Unknown command', {
                type
              });
              callback(`rest: unknown command "${type}"`);
            } catch (err) {
              logger.error(type, {
                err
              });
              callback(err.message || err);
            }

        }
      } catch (err) {
        logger.warn('rest error', {
          err
        });
        callback(err.message || err);
      }
    });
  });
}

exports.default = init;
//# sourceMappingURL=index-node10.cjs.js.map
