var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import Logger from 'nightingale-logger';

import t from 'flow-runtime';
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

      openCursors = null;
      timeouts = null;
      activeListeners = null;
    });

    var nextIdCursor = 1;

    socket.on('rest', function (_arg, args, callback) {
      var _argsType = t.array(t.any());

      var _callbackType = t.function();

      t.param('args', _argsType).assert(args);
      t.param('callback', _callbackType).assert(callback);

      var _t$object$assert = t.object(t.property('type', t.string()), t.property('restName', t.string())).assert(_arg),
          type = _t$object$assert.type,
          restName = _t$object$assert.restName;

      logger.info('rest', { type: type, restName: restName, args: args });
      switch (type) {
        case 'createCursor':
          {
            if (openCursors.size > MAX_OPENED_CURSORS) return callback('too many cursors');

            var id = nextIdCursor++;

            var _args = _slicedToArray(args, 1),
                options = _args[0];

            var cursor = restService.createCursor(restName, options);
            if (!cursor) return callback('failed to create cursor');

            timeouts.set(id, setTimeout(function () {
              logger.warn('socket closed by timeout', { id: id, restName: restName });
              closeCursor(id);
            }));

            return callback(null, id);
          }

        case 'cursor toArray':
          {
            var _args2 = _slicedToArray(args, 1),
                _options = _args2[0];

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
            var _args3 = _slicedToArray(args, 2),
                _args3$ = _args3[0],
                typeCursorAction = _args3$.type,
                idCursor = _args3$.id,
                cursorArgs = _args3[1];

            var _cursor = openCursors.get(idCursor);
            if (!_cursor) return callback('failed to find cursor "' + idCursor + '"');
            switch (typeCursorAction) {
              case 'close':
                closeCursor(idCursor);
                return callback();

              case 'advance':
              case 'next':
              case 'count':
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
          return restService[type].apply(restService, [restName].concat(_toConsumableArray(args))).then(function (result) {
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