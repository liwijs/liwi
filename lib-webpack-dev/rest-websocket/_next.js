var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import _t from 'tcomb-forked';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import Logger from 'nightingale-logger';

var MAX_OPENED_CURSORS = 5;
var logger = new Logger('liwi.rest-websocket');

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

    socket.on('rest', function (_ref, args, callback) {
      var type = _ref.type,
          restName = _ref.restName;

      _assert({
        type: type,
        restName: restName
      }, _t.interface({
        type: _t.String,
        restName: _t.String
      }), '{ type, restName }');

      _assert(args, _t.list(_t.Any), 'args');

      _assert(callback, _t.Function, 'callback');

      logger.info('rest', { type: type, restName: restName, args: args });
      switch (type) {
        case 'createCursor':
          {
            var _ret = function () {
              if (openCursors.size > MAX_OPENED_CURSORS) return {
                  v: callback('too many cursors')
                };

              var id = nextIdCursor++;

              var _args = _slicedToArray(args, 1),
                  options = _args[0];

              var cursor = restService.createCursor(restName, options);
              if (!cursor) return {
                  v: callback('failed to create cursor')
                };

              timeouts.set(id, setTimeout(function () {
                logger.warn('socket closed by timeout', { id: id, restName: restName });
                closeCursor(id);
              }));

              return {
                v: callback(null, id)
              };
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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