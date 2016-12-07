var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import _t from 'tcomb-forked';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

    socket.on('rest', function (_ref, args, callback) {
      var type = _ref.type,
          restName = _ref.restName,
          buffer = _ref.buffer;

      _assert({
        type: type,
        restName: restName,
        buffer: buffer
      }, _t.interface({
        type: _t.String,
        restName: _t.String,
        buffer: _t.maybe(ObjectBufferType)
      }), '{ type, restName, buffer }');

      _assert(args, _t.union([_t.maybe(_t.list(_t.Any)), _t.Function]), 'args');

      _assert(callback, _t.maybe(_t.Function), 'callback');

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

      logger.info('rest', { type: type, restName: restName, args: args });
      switch (type) {
        case 'cursor toArray':
          {
            var _args = args,
                _args2 = _slicedToArray(_args, 1),
                options = _args2[0];

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
              throw new Error('rest: ' + restName + '.' + type + ' is not available');
            }

            return restResource[type].apply(restResource, [socket.user].concat(_toConsumableArray(args))).then(function (result) {
              return callback(null, encode(result));
            }).catch(function (err) {
              logger.error(type, { err: err });
              callback(err.message || err);
            });
          } catch (err) {
            logger.error(type, { err: err });
            callback(err.message || err);
          }
          break;

        case 'fetch':
        case 'subscribe':
        case 'fetchAndSubscribe':
          try {
            var _ret = function () {
              var _args3 = args,
                  _args4 = _slicedToArray(_args3, 3),
                  key = _args4[0],
                  eventName = _args4[1],
                  _args4$ = _args4[2],
                  otherArgs = _args4$ === undefined ? [] : _args4$;

              if (!key.startsWith('query')) {
                throw new Error('Invalid query key');
              }

              var query = restResource(socket.user, key);
              if (!query) {
                throw new Error('rest: ' + restName + '.' + type + '.' + key + ' is not available');
              }

              if (type === 'fetch') {
                return {
                  v: query[type].apply(query, [function (result) {
                    return callback(null, encode(result));
                  }].concat(_toConsumableArray(otherArgs))).catch(function (err) {
                    logger.error(type, { err: err });
                    callback(err.message || err);
                  })
                };
              } else {
                var watcher = query[type](function (err, result) {
                  if (err) {
                    logger.error(type, { err: err });
                  }
                  socket.emit(eventName, err, encode(result));
                });
                watcher.then(function () {
                  return callback();
                }, function (err) {
                  logger.error(type, { err: err });
                  callback(err.message || err);
                });

                openWatchers.add(watcher);
              }
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
          } catch (err) {
            logger.error(type, { err: err });
            callback(err.message || err);
          }
          break;

        default:
          try {
            logger.warn('Unknown command', { type: type });
            callback('rest: unknown command "' + type + '"');
          } catch (err) {
            logger.error(type, { err: err });
            callback(err.message || err);
          }
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