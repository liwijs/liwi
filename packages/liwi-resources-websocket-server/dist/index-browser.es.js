import Logger from 'nightingale-logger';
import { decode, encode } from 'extended-json';

/* eslint-disable complexity */
var logger = new Logger('liwi:rest-websocket');
function init(io, resourcesService) {
  io.on('connection', function (socket) {
    var openWatchers = new Set();
    socket.on('disconnect', function () {
      openWatchers.forEach(function (watcher) {
        return watcher.stop();
      });
    });
    socket.on('resource', function (_ref, callback) {
      var type = _ref.type,
          resourceName = _ref.resourceName,
          json = _ref.json,
          key,
          eventName,
          otherArgs,
          _key,
          params;

      try {
        var value = json && decode(json);
        var resource = resourcesService.get(resourceName);
        logger.info('resource', {
          type: type,
          resourceName: resourceName,
          value: value
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
              key = value[0], eventName = value[1], otherArgs = value[2];

              if (!key.startsWith('query')) {
                throw new Error('Invalid query key');
              }

              var queryOptions = resource.queries[key]; // TODO resource.criteria(queryOptions.criteria) & co ?

              if (!queryOptions) {
                throw new Error("rest: " + resourceName + "." + type + "." + key + " is not available");
              }

              var query = resource.store.createQuery(queryOptions); // todo pass connected user

              if (type === 'fetch') {
                return query.fetch.apply(query, [function (result) {
                  return callback(null, result && encode(result));
                }].concat(otherArgs)).catch(function (err) {
                  logger.error(type, {
                    err: err
                  });
                  callback(err.message || err);
                });
              } else {
                var watcher = query[type](function (err, result) {
                  if (err) {
                    logger.error(type, {
                      err: err
                    });
                  }

                  socket.emit(eventName, err, result && encode(result));
                });
                watcher.then(function () {
                  return callback(null);
                }, function (err) {
                  logger.error(type, {
                    err: err
                  });
                  callback(err.message);
                });
                openWatchers.add(watcher);
              }
            } catch (err) {
              logger.error(type, {
                err: err
              });
              callback(err.message || err);
            }

            break;

          case 'do':
            {
              try {
                _key = value[0], params = value[1];
                var operation = resource.operations[_key];

                if (!operation) {
                  throw new Error('Operation not found');
                }

                operation(params, socket.user).then(function (result) {
                  return callback(null, result);
                }, function (err) {
                  logger.error(type, {
                    err: err
                  });
                  callback(err.message);
                });
              } catch (err) {
                logger.error(type, {
                  err: err
                });
                callback(err.message || err);
              }

              break;
            }

          default:
            try {
              logger.warn('Unknown command', {
                type: type
              });
              callback("rest: unknown command \"" + type + "\"");
            } catch (err) {
              logger.error(type, {
                err: err
              });
              callback(err.message || err);
            }

        }
      } catch (err) {
        logger.warn('rest error', {
          err: err
        });
        callback(err.message || err);
      }
    });
  });
}

export default init;
//# sourceMappingURL=index-browser.es.js.map
