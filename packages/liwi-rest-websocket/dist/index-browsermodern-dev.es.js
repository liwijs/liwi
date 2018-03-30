import Logger from 'nightingale-logger';
import { encode, decode } from 'extended-json';
import t from 'flow-runtime';

const logger = new Logger('liwi:rest-websocket');

function init(io, restService) {
  io.on('connection', function (socket) {
    const openWatchers = new Set();

    socket.on('disconnect', function () {
      openWatchers.forEach(function (watcher) {
        return watcher.stop();
      });
    });

    socket.on('rest', function (_arg, args, callback) {
      let _argsType = t.union(t.nullable(t.array(t.any())), t.function());

      let _callbackType = t.nullable(t.function());

      t.param('args', _argsType).assert(args);
      t.param('callback', _callbackType).assert(callback);
      let { type, restName, json } = t.object(t.property('json', t.nullable(t.string()), true), t.property('restName', t.string()), t.property('type', t.string())).assert(_arg);

      try {
        if (json) {
          if (callback) {
            throw new Error('Cannot have args and json.');
          }

          callback = _callbackType.assert(args);
          args = _argsType.assert(decode(json));
          if (!Array.isArray(args)) {
            logger.debug('args', { args });

            if (callback) {
              throw new Error('Invalid args');
            }
          }
        }

        if (!callback) {
          logger['warn']('callback missing');
          return;
        }

        const restResource = restService.get(restName);

        logger.info('rest', { type, restName, args });
        switch (type) {
          case 'cursor toArray':
            {
              const [options] = args;
              return restService.createCursor(restResource, socket.user, options).then(function (cursor) {
                return cursor.toArray();
              }).then(function (results) {
                return callback(null, encode(results));
              }).catch(function (err) {
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
              if (!restResource[type]) {
                throw new Error(`rest: ${restName}.${type} is not available`);
              }

              // eslint-disable-next-line prettier/prettier
              return restResource[type](socket.user, ...args).then(function (result) {
                return callback(null, encode(result));
              }).catch(function (err) {
                logger.error(type, { err });
                callback(err.message || err);
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
                throw new Error(`rest: ${restName}.${type}.${key} is not available`);
              }

              if (type === 'fetch') {
                return query[type](function (result) {
                  return callback(null, result && encode(result));
                }, ...otherArgs).catch(function (err) {
                  logger.error(type, { err });
                  callback(err.message || err);
                });
              } else {
                const watcher = query[type](function (err, result) {
                  if (err) {
                    logger.error(type, { err });
                  }

                  socket.emit(eventName, err, result && encode(result));
                });
                watcher.then(function () {
                  return callback();
                }, function (err) {
                  logger.error(type, { err });
                  callback(err.message || err);
                });

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
    });
  });
}

export default init;
//# sourceMappingURL=index-browsermodern-dev.es.js.map
