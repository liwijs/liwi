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
    socket.on('resource', function (_ref2, callback) {
      var type = _ref2.type,
          resourceName = _ref2.resourceName,
          json = _ref2.json;

      _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee() {
        var value, resource, _resource, key, params, eventName, query, watcherKey, watcher, subscribeHook, _key, _watcherKey, watcherAndSubscribeHook, _resource2, _key2, _params, operation;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                value = json && decode(json);
                _context.t0 = type;
                _context.next = _context.t0 === 'cursor toArray' ? 5 : _context.t0 === 'fetch' ? 8 : _context.t0 === 'subscribe' ? 8 : _context.t0 === 'fetchAndSubscribe' ? 8 : _context.t0 === 'unsubscribe' ? 38 : _context.t0 === 'do' ? 48 : 63;
                break;

              case 5:
                resource = resourcesService.getCursorResource(resourceName);
                resourcesService.createCursor(resource, socket.user, value).then(function (cursor) {
                  return cursor.toArray();
                }).then(function (results) {
                  return callback(null, encode(results));
                }).catch(function (err) {
                  logger.error(type, err);
                  callback(err.message);
                });
                return _context.abrupt("break", 64);

              case 8:
                _context.prev = 8;
                _resource = resourcesService.getServiceResource(resourceName);
                logger.info('resource', {
                  type: type,
                  resourceName: resourceName,
                  value: value
                });
                key = value[0], params = value[1], eventName = value[2];

                if (key.startsWith('query')) {
                  _context.next = 14;
                  break;
                }

                throw new Error('Invalid query key');

              case 14:
                _context.next = 16;
                return _resource.queries[key](params, socket.user);

              case 16:
                query = _context.sent;

                if (!(type === 'fetch')) {
                  _context.next = 21;
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
                _context.next = 31;
                break;

              case 21:
                watcherKey = resourceName + "__" + key;

                if (!openWatchers.has(watcherKey)) {
                  _context.next = 26;
                  break;
                }

                logger.warn('Already have a watcher for this key. Cannot add a new one', {
                  watcherKey: watcherKey,
                  key: key
                });
                callback('Already have a watcher for this key. Cannot add a new one');
                return _context.abrupt("return");

              case 26:
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

              case 31:
                _context.next = 37;
                break;

              case 33:
                _context.prev = 33;
                _context.t1 = _context["catch"](8);
                logger.error(type, {
                  err: _context.t1
                });
                callback(_context.t1.message || _context.t1);

              case 37:
                return _context.abrupt("break", 64);

              case 38:
                _key = value[0];
                _watcherKey = resourceName + "__" + _key;
                watcherAndSubscribeHook = openWatchers.get(_watcherKey);

                if (watcherAndSubscribeHook) {
                  _context.next = 44;
                  break;
                }

                logger.warn('tried to unsubscribe non existing watcher', {
                  key: _key
                });
                return _context.abrupt("return", callback(null));

              case 44:
                openWatchers.delete(_watcherKey);
                unsubscribeWatcher(watcherAndSubscribeHook);
                callback(null);
                return _context.abrupt("break", 64);

              case 48:
                _context.prev = 48;
                _resource2 = resourcesService.getServiceResource(resourceName);
                logger.info('resource', {
                  type: type,
                  resourceName: resourceName,
                  value: value
                });
                _key2 = value[0], _params = value[1];
                operation = _resource2.operations[_key2];

                if (operation) {
                  _context.next = 55;
                  break;
                }

                throw new Error('Operation not found');

              case 55:
                operation(_params, socket.user).then(function (result) {
                  return callback(null, result && encode(result));
                }, function (err) {
                  logger.error(type, {
                    err: err
                  });
                  callback(err.message);
                });
                _context.next = 62;
                break;

              case 58:
                _context.prev = 58;
                _context.t2 = _context["catch"](48);
                logger.error(type, {
                  err: _context.t2
                });
                callback(_context.t2.message || _context.t2);

              case 62:
                return _context.abrupt("break", 64);

              case 63:
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

              case 64:
                _context.next = 70;
                break;

              case 66:
                _context.prev = 66;
                _context.t3 = _context["catch"](0);
                logger.warn('rest error', {
                  err: _context.t3
                });
                callback(_context.t3.message || _context.t3);

              case 70:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 66], [8, 33], [48, 58]]);
      }))();
    });
  });
}

export default init;
//# sourceMappingURL=index-browser-dev.es.js.map
