/* global PRODUCTION */
import Logger from 'nightingale-logger';
import { encode, decode } from '../extended-json';

var logger = new Logger('liwi:rest-websocket');

export default function init(io, restService) {
  io.on('connection', function (socket) {
    var openWatchers = new Set();

    socket.on('disconnect', function () {
      openWatchers.forEach(function (watcher) {
        return watcher.stop();
      });
    });

    socket.on('rest', function ({ type, restName, json }, args, callback) {
      try {
        if (json) {

          callback = args;
          args = decode(json);
          if (!Array.isArray(args)) {
            logger.debug('args', { args });

            if (callback) {
              throw new Error('Invalid args');
            }
          }
        }

        if (!callback) {
          logger['error']('callback missing');
          return;
        }

        var restResource = restService.get(restName);

        logger.info('rest', { type, restName, args });
        switch (type) {
          case 'cursor toArray':
            {
              var [options] = args;
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
              var _ret = function () {
                var [key, eventName, otherArgs = []] = args;

                if (!key.startsWith('query')) {
                  throw new Error('Invalid query key');
                }

                var query = restResource.queries[key]; // todo pass connected user
                if (!query) {
                  throw new Error(`rest: ${ restName }.${ type }.${ key } is not available`);
                }

                if (type === 'fetch') {
                  return {
                    v: query[type](function (result) {
                      return callback(null, result && encode(result));
                    }, ...otherArgs).catch(function (err) {
                      logger.error(type, { err });
                      callback(err.message || err);
                    })
                  };
                } else {
                  var watcher = query[type](function (err, result) {
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
              }();

              if (typeof _ret === "object") return _ret.v;
            } catch (err) {
              logger.error(type, { err });
              callback(err.message || err);
            }
            break;

          default:
            try {
              logger.warn('Unknown command', { type });
              callback(`rest: unknown command "${ type }"`);
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
//# sourceMappingURL=index.js.map