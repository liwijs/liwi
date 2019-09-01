import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import Logger from 'nightingale-logger';
import { decode, encode } from 'extended-json';

var logger = new Logger('liwi:rest-websocket');
function init(io, resourcesService) {
  io.on('connection', function (socket) {
    var openWatchers = new Map();

    var unsubscribeWatcher = function unsubscribeWatcher(_ref) {
      var watcher = _ref.watcher,
          subscribeHook = _ref.subscribeHook,
          params = _ref.params;
      watcher.stop();

      if (subscribeHook) {
        subscribeHook.unsubscribed(socket.user, params);
      }
    };

    socket.on('disconnect', function () {
      openWatchers.forEach(unsubscribeWatcher);
    });
    socket.on('resource',
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(_ref2, callback) {
        var type, resourceName, json, value, resource, _resource, key, params, eventName, query, watcherKey, watcher, subscribeHook, _key, _watcherKey, watcherAndSubscribeHook, _resource2, _key2, _params, operation;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                type = _ref2.type, resourceName = _ref2.resourceName, json = _ref2.json;
                _context.prev = 1;
                value = json && decode(json);
                _context.t0 = type;
                _context.next = _context.t0 === 'cursor toArray' ? 6 : _context.t0 === 'fetch' ? 9 : _context.t0 === 'subscribe' ? 9 : _context.t0 === 'fetchAndSubscribe' ? 9 : _context.t0 === 'unsubscribe' ? 39 : _context.t0 === 'do' ? 49 : 64;
                break;

              case 6:
                resource = resourcesService.getCursorResource(resourceName);
                resourcesService.createCursor(resource, socket.user, value).then(function (cursor) {
                  return cursor.toArray();
                }).then(function (results) {
                  return callback(null, encode(results));
                }).catch(function (err) {
                  logger.error(type, err);
                  callback(err.message);
                });
                return _context.abrupt("break", 65);

              case 9:
                _context.prev = 9;
                _resource = resourcesService.getServiceResource(resourceName);
                logger.info('resource', {
                  type: type,
                  resourceName: resourceName,
                  value: value
                });
                key = value[0], params = value[1], eventName = value[2];

                if (key.startsWith('query')) {
                  _context.next = 15;
                  break;
                }

                throw new Error('Invalid query key');

              case 15:
                _context.next = 17;
                return _resource.queries[key](params, socket.user);

              case 17:
                query = _context.sent;

                if (!(type === 'fetch')) {
                  _context.next = 22;
                  break;
                }

                query.fetch(function (result) {
                  return callback(null, result && encode(result));
                }).catch(function (err) {
                  logger.error(type, {
                    err: err
                  });
                  callback(err.message || err);
                });
                _context.next = 32;
                break;

              case 22:
                watcherKey = resourceName + "__" + key;

                if (!openWatchers.has(watcherKey)) {
                  _context.next = 27;
                  break;
                }

                logger.warn('Already have a watcher for this key. Cannot add a new one', {
                  watcherKey: watcherKey,
                  key: key
                });
                callback('Already have a watcher for this key. Cannot add a new one');
                return _context.abrupt("return");

              case 27:
                watcher = query[type](function (err, result) {
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
                subscribeHook = _resource.subscribeHooks && _resource.subscribeHooks[key];
                openWatchers.set(watcherKey, {
                  watcher: watcher,
                  subscribeHook: subscribeHook,
                  params: subscribeHook ? params : undefined
                });

                if (subscribeHook) {
                  subscribeHook.subscribed(socket.user, params);
                }

              case 32:
                _context.next = 38;
                break;

              case 34:
                _context.prev = 34;
                _context.t1 = _context["catch"](9);
                logger.error(type, {
                  err: _context.t1
                });
                callback(_context.t1.message || _context.t1);

              case 38:
                return _context.abrupt("break", 65);

              case 39:
                _key = value[0];
                _watcherKey = resourceName + "__" + _key;
                watcherAndSubscribeHook = openWatchers.get(_watcherKey);

                if (watcherAndSubscribeHook) {
                  _context.next = 45;
                  break;
                }

                logger.warn('tried to unsubscribe non existing watcher', {
                  key: _key
                });
                return _context.abrupt("return", callback(null));

              case 45:
                openWatchers.delete(_watcherKey);
                unsubscribeWatcher(watcherAndSubscribeHook);
                callback(null);
                return _context.abrupt("break", 65);

              case 49:
                _context.prev = 49;
                _resource2 = resourcesService.getServiceResource(resourceName);
                logger.info('resource', {
                  type: type,
                  resourceName: resourceName,
                  value: value
                });
                _key2 = value[0], _params = value[1];
                operation = _resource2.operations[_key2];

                if (operation) {
                  _context.next = 56;
                  break;
                }

                throw new Error('Operation not found');

              case 56:
                operation(_params, socket.user).then(function (result) {
                  return callback(null, result && encode(result));
                }, function (err) {
                  logger.error(type, {
                    err: err
                  });
                  callback(err.message);
                });
                _context.next = 63;
                break;

              case 59:
                _context.prev = 59;
                _context.t2 = _context["catch"](49);
                logger.error(type, {
                  err: _context.t2
                });
                callback(_context.t2.message || _context.t2);

              case 63:
                return _context.abrupt("break", 65);

              case 64:
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

              case 65:
                _context.next = 71;
                break;

              case 67:
                _context.prev = 67;
                _context.t3 = _context["catch"](1);
                logger.warn('rest error', {
                  err: _context.t3
                });
                callback(_context.t3.message || _context.t3);

              case 71:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 67], [9, 34], [49, 59]]);
      }));

      return function () {
        return _ref3.apply(this, arguments);
      };
    }());
  });
}

export default init;
//# sourceMappingURL=index-browser-dev.es.js.map
