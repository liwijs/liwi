import _t from 'tcomb-forked';
/* global PRODUCTION */
import Logger from 'nightingale-logger';
import { encode, decode } from '../msgpack';

var logger = new Logger('liwi:rest-websocket');

var ObjectBufferType = _t.interface({
  type: _t.enums.of(['Buffer']),
  data: _t.list(_t.Number)
}, 'ObjectBufferType');

export default function init(io, restService) {
  io.on('connection', function (socket) {
    var openWatchers = new Set();

    socket.on('disconnect', function () {
      openWatchers.forEach(function (watcher) {
        return watcher.stop();
      });
    });

    socket.on('rest', function ({ type, restName, buffer }, args, callback) {
      _assert({
        type,
        restName,
        buffer
      }, _t.interface({
        type: _t.String,
        restName: _t.String,
        buffer: _t.maybe(ObjectBufferType)
      }), '{ type, restName, buffer }');

      _assert(args, _t.union([_t.maybe(_t.list(_t.Any)), _t.Function]), 'args');

      _assert(callback, _t.maybe(_t.Function), 'callback');

      try {
        if (buffer) {
          if (callback) {
            throw new Error('Cannot have args and buffer.');
          }

          callback = args;
          args = decode(buffer);
        }

        if (!callback) {
          throw new Error('`callback` missing.');
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
              if (!restResource[type]) {
                throw new Error(`rest: ${ restName }.${ type } is not available`);
              }

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
                    socket.emit(eventName, err, encode(result));
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

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=index.js.map