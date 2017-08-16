function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } return Array.from(arr); }

import Logger from 'nightingale-logger';

var MAX_OPENED_CURSORS = 5;
var logger = new Logger('liwi:rest-websocket');

export default function init(io, restService) {
  io.on('connection', function (socket) {
    var openCursors = new Map();
    var timeouts = new Map();
    var activeListeners = new Map();

    var closeCursor = function closeCursor(id) {
      clearTimeout(timeouts[id]), timeouts.delete(id), openCursors[id].close(), openCursors.delete(id);
    };

    socket.on('disconnect', function () {
      openCursors.forEach(function (cursor) {
        return cursor.close();
      }), timeouts.forEach(function (timeout) {
        return clearTimeout(timeout);
      }), activeListeners.forEach(function (listener) {
        return listener.close();
      }), openCursors = null, timeouts = null, activeListeners = null;
    });


    var nextIdCursor = 1;

    socket.on('rest', function (_ref, args, callback) {
      var type = _ref.type,
          restName = _ref.restName;

      switch (logger.info('rest', { type: type, restName: restName, args: args }), type) {
        case 'createCursor':
          {
            if (openCursors.size > MAX_OPENED_CURSORS) return callback('too many cursors');

            var id = nextIdCursor++;
            var options = args[0];

            var cursor = restService.createCursor(restName, options);
            return cursor ? (timeouts.set(id, setTimeout(function () {
              logger.warn('socket closed by timeout', { id: id, restName: restName }), closeCursor(id);
            })), callback(null, id)) : callback('failed to create cursor');
          }

        case 'cursor toArray':
          {
            var _options = args[0];

            return restService.createCursor(restName, _options).then(function (cursor) {
              return cursor.toArray();
            }).then(function (results) {
              return callback(null, results);
            }).catch(function (err) {
              return callback(err.message);
            });
          }

        case 'cursor':
          {
            var _args$ = args[0],
                typeCursorAction = _args$.type,
                idCursor = _args$.id,
                cursorArgs = args[1];


            var _cursor = openCursors.get(idCursor);
            if (!_cursor) return callback('failed to find cursor "' + idCursor + '"');
            switch (typeCursorAction) {
              case 'close':
                return closeCursor(idCursor), callback();

              case 'advance':
              case 'next':
              case 'count':
                // eslint-disable-next-line prettier/prettier
                return _cursor[type].apply(_cursor, _toConsumableArray(cursorArgs)).then(function (result) {
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
                callback('Unknown command: "' + type + '"');

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
          // eslint-disable-next-line prettier/prettier
          return restService[type].apply(restService, [restName].concat(args)).then(function (result) {
            return callback(null, result);
          }).catch(function (err) {
            return callback(err.message || err);
          });

        default:
          callback('Unknown command: "' + type + '"');

      }
    });
  });
}
//# sourceMappingURL=_next.js.map