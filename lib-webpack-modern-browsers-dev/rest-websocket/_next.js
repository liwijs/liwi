import _t from 'tcomb-forked';
import Logger from 'nightingale-logger';

var MAX_OPENED_CURSORS = 5;
var logger = new Logger('liwi:rest-websocket');

export default function init(io, restService) {
  io.on('connection', function (socket) {
    var openCursors = new Map();
    var timeouts = new Map();
    var activeListeners = new Map();

    var closeCursor = function closeCursor(id) {
      clearTimeout(timeouts[id]);
      timeouts.delete(id);
      openCursors[id].close();
      openCursors.delete(id);
    };

    socket.on('disconnect', function () {
      openCursors.forEach(function (cursor) {
        return cursor.close();
      });
      timeouts.forEach(function (timeout) {
        return clearTimeout(timeout);
      });
      activeListeners.forEach(function (listener) {
        return listener.close();
      });

      openCursors = timeouts = activeListeners = null;
    });

    var nextIdCursor = 1;

    socket.on('rest', function ({ type, restName }, args, callback) {
      _assert({
        type,
        restName
      }, _t.interface({
        type: _t.String,
        restName: _t.String
      }), '{ type, restName }');

      _assert(args, _t.list(_t.Any), 'args');

      _assert(callback, _t.Function, 'callback');

      logger.info('rest', { type, restName, args });
      switch (type) {
        case 'createCursor':
          {
            var _ret = function () {
              if (openCursors.size > MAX_OPENED_CURSORS) return {
                  v: callback('too many cursors')
                };

              var id = nextIdCursor++;
              var [options] = args;
              var cursor = restService.createCursor(restName, options);
              if (!cursor) return {
                  v: callback('failed to create cursor')
                };

              timeouts.set(id, setTimeout(function () {
                logger.warn('socket closed by timeout', { id, restName });
                closeCursor(id);
              }));

              return {
                v: callback(null, id)
              };
            }();

            if (typeof _ret === "object") return _ret.v;
          }

        case 'cursor toArray':
          {
            var [options] = args;
            return restService.createCursor(restName, options).then(function (cursor) {
              return cursor.toArray();
            }).then(function (results) {
              return callback(null, results);
            }).catch(function (err) {
              return callback(err.message);
            });
          }

        case 'cursor':
          {
            var [{ type: typeCursorAction, id: idCursor }, cursorArgs] = args;

            var cursor = openCursors.get(idCursor);
            if (!cursor) return callback(`failed to find cursor "${ idCursor }"`);
            switch (typeCursorAction) {
              case 'close':
                closeCursor(idCursor);
                return callback();

              case 'advance':
              case 'next':
              case 'count':
                return cursor[type](...cursorArgs).then(function (result) {
                  return callback(null, result);
                }).catch(function (err) {
                  return callback(err.message || err);
                });
              /* cursor.next().then((key) => {
                  if (!key) return callback(null);
                  return cursor.result();
              }).then(result => {
                      response(null, restService.transform(data));
                  });
              }, () => {
                  response(null);
              }); */

              default:
                callback(`Unknown command: "${ type }"`);
            }

            break;
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
          return restService[type](restName, ...args).then(function (result) {
            return callback(null, result);
          }).catch(function (err) {
            return callback(err.message || err);
          });

        default:
          callback(`Unknown command: "${ type }"`);
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
//# sourceMappingURL=_next.js.map