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
          options,
          key,
          eventName,
          _args$,
          otherArgs;

      try {
        var args = decode(json);

        if (!Array.isArray(args)) {
          logger.debug('args', {
            args: args
          });

          if (callback) {
            throw new Error('Invalid args');
          }
        }

        var resource = resourcesService.get(resourceName);
        logger.info('resource', {
          type: type,
          resourceName: resourceName,
          args: args
        });

        switch (type) {
          case 'cursor toArray':
            {
              options = args[0];
              return resourcesService.createCursor(resource, socket.user, options).then(function (cursor) {
                return cursor.toArray();
              }).then(function (results) {
                return callback(null, encode(results));
              }).catch(function (err) {
                logger.error(type, err);
                callback(err.message);
              });
            }

          case 'findByKey':
          case 'findOne':
          case 'insertOne':
          case 'replaceOne':
          case 'replaceSeveral':
          case 'upsertOneWithInfo':
          case 'partialUpdateByKey':
          case 'partialUpdateMany':
          case 'deleteByKey':
          case 'deleteMany':
            callback('TODO: to implement');
            break;
          // try {
          //   if (!PRODUCTION && !resource[type]) {
          //     throw new Error(
          //       `rest: ${resourceName}.${type} is not available`,
          //     );
          //   }
          //
          //   // eslint-disable-next-line prettier/prettier
          //   return resource[type](socket.user, ...args)
          //     .then((result: any) => callback(null, encode(result)))
          //     .catch((err: Error) => {
          //       logger.error(type, { err });
          //       callback(err.message);
          //     });
          // } catch (err) {
          //   logger.error(type, { err });
          //   callback(err.message || err);
          // }
          // break;

          case 'fetch':
          case 'subscribe':
          case 'fetchAndSubscribe':
            try {
              key = args[0], eventName = args[1], _args$ = args[2], otherArgs = _args$ === void 0 ? [] : _args$;

              if (!key.startsWith('query')) {
                throw new Error('Invalid query key');
              }

              var queryOptions = resource.queries[key]; // TODO resource.criteria(queryOptions.criteria) & co ?

              if (!queryOptions) {
                throw new Error("rest: " + resourceName + "." + type + "." + key + " is not available");
              }

              console.log(queryOptions);
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
