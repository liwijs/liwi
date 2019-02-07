'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Logger = _interopDefault(require('nightingale-logger'));
var extendedJson = require('extended-json');

/* eslint-disable complexity */
const logger = new Logger('liwi:rest-websocket');
function init(io, resourcesService) {
  io.on('connection', socket => {
    const openWatchers = new Set();
    socket.on('disconnect', () => {
      openWatchers.forEach(watcher => watcher.stop());
    });
    socket.on('resource', ({
      type,
      resourceName,
      json
    }, callback) => {
      try {
        const value = json && extendedJson.decode(json);
        const resource = resourcesService.get(resourceName);
        logger.info('resource', {
          type,
          resourceName,
          value
        });

        switch (type) {
          case 'cursor toArray':
            {
              return resourcesService.createCursor(resource, socket.user, value).then(cursor => cursor.toArray()).then(results => callback(null, extendedJson.encode(results))).catch(err => {
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

              const queryOptions = resource.queries[key]; // TODO resource.criteria(queryOptions.criteria) & co ?

              if (!queryOptions) {
                throw new Error(`rest: ${resourceName}.${type}.${key} is not available`);
              }

              const query = resource.store.createQuery(queryOptions); // todo pass connected user

              if (type === 'fetch') {
                return query.fetch(result => callback(null, result && extendedJson.encode(result)), ...otherArgs).catch(err => {
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

          case 'do':
            {
              try {
                const [key, params] = value;
                const operation = resource.operations[key];

                if (!operation) {
                  throw new Error('Operation not found');
                }

                operation(params, socket.user).then(result => callback(null, result), err => {
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
            }

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
//# sourceMappingURL=index-node8-dev.cjs.js.map
