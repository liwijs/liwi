import Logger from 'nightingale-logger';
import { decode, encode } from 'extended-json';

/* eslint-disable complexity */
const logger = new Logger('liwi:rest-websocket');
function init(io, resourcesService) {
  io.on('connection', function (socket) {
    const openWatchers = new Set();
    socket.on('disconnect', function () {
      openWatchers.forEach(function (watcher) {
        return watcher.stop();
      });
    });
    socket.on('resource', function ({
      type,
      resourceName,
      json
    }, callback) {
      try {
        const value = json && decode(json);
        const resource = resourcesService.get(resourceName);
        logger.info('resource', {
          type,
          resourceName,
          value
        });

        switch (type) {
          case 'cursor toArray':
            {
              return resourcesService.createCursor(resource, socket.user, value).then(function (cursor) {
                return cursor.toArray();
              }).then(function (results) {
                return callback(null, encode(results));
              }).catch(function (err) {
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
                return query.fetch(function (result) {
                  return callback(null, result && encode(result));
                }, ...otherArgs).catch(function (err) {
                  logger.error(type, {
                    err
                  });
                  callback(err.message || err);
                });
              } else {
                const watcher = query[type](function (err, result) {
                  if (err) {
                    logger.error(type, {
                      err
                    });
                  }

                  socket.emit(eventName, err, result && encode(result));
                });
                watcher.then(function () {
                  return callback(null);
                }, function (err) {
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

                operation(params).then(function (result) {
                  return callback(null, result);
                }, function (err) {
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

export default init;
//# sourceMappingURL=index-browsermodern.es.js.map
