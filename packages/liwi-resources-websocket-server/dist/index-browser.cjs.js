'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Logger = _interopDefault(require('nightingale-logger'));
var extendedJson = require('extended-json');

/* eslint-disable complexity, max-lines */
var logger = new Logger('liwi:rest-websocket');
function init(io, resourcesService) {
  io.on('connection', function (socket) {
    var openWatchers = new Map();

    var unsubscribeWatcher = function unsubscribeWatcher(_ref) {
      var watcher = _ref.watcher,
          subscribeHook = _ref.subscribeHook;
      watcher.stop();

      if (subscribeHook) {
        subscribeHook.unsubscribed(socket.user);
      }
    };

    socket.on('disconnect', function () {
      openWatchers.forEach(unsubscribeWatcher);
    });
    socket.on('resource', function (_ref2, callback) {
      var type = _ref2.type,
          resourceName = _ref2.resourceName,
          json = _ref2.json,
          key,
          params,
          eventName,
          _key,
          _key2,
          _params;

      try {
        var value = json && extendedJson.decode(json);

        switch (type) {
          case 'cursor toArray':
            {
              var resource = resourcesService.getCursorResource(resourceName);
              resourcesService.createCursor(resource, socket.user, value).then(function (cursor) {
                return cursor.toArray();
              }).then(function (results) {
                return callback(null, extendedJson.encode(results));
              }).catch(function (err) {
                logger.error(type, err);
                callback(err.message);
              });
              break;
            }

          case 'fetch':
          case 'subscribe':
          case 'fetchAndSubscribe':
            try {
              var _resource = resourcesService.getServiceResource(resourceName);

              logger.info('resource', {
                type: type,
                resourceName: resourceName,
                value: value
              });
              key = value[0], params = value[1], eventName = value[2];

              if (!key.startsWith('query')) {
                throw new Error('Invalid query key');
              }

              var query = _resource.queries[key](params, socket.user);

              if (type === 'fetch') {
                query.fetch(function (result) {
                  return callback(null, result && extendedJson.encode(result));
                }).catch(function (err) {
                  logger.error(type, {
                    err: err
                  });
                  callback(err.message || err);
                });
              } else {
                var watcherKey = resourceName + "__" + key;

                if (openWatchers.has(watcherKey)) {
                  logger.warn('Already have a watcher for this key. Cannot add a new one', {
                    watcherKey: watcherKey,
                    key: key
                  });
                  callback('Already have a watcher for this key. Cannot add a new one');
                  return;
                }

                var _watcher = query[type](function (err, result) {
                  if (err) {
                    logger.error(type, {
                      err: err
                    });
                  }

                  socket.emit(eventName, err, result && extendedJson.encode(result));
                });

                _watcher.then(function () {
                  return callback(null);
                }, function (err) {
                  logger.error(type, {
                    err: err
                  });
                  callback(err.message);
                });

                var _subscribeHook = _resource.subscribeHooks && _resource.subscribeHooks[key];

                openWatchers.set(watcherKey, {
                  watcher: _watcher,
                  subscribeHook: _subscribeHook
                });

                if (_subscribeHook) {
                  _subscribeHook.subscribed(socket.user);
                }
              }
            } catch (err) {
              logger.error(type, {
                err: err
              });
              callback(err.message || err);
            }

            break;

          case 'unsubscribe':
            {
              _key = value[0];

              var _watcherKey = resourceName + "__" + _key;

              var watcherAndSubscribeHook = openWatchers.get(_watcherKey);

              if (!watcherAndSubscribeHook) {
                logger.warn('tried to unsubscribe non existing watcher', {
                  key: _key
                });
                return callback(null);
              }

              openWatchers.delete(_watcherKey);
              unsubscribeWatcher(watcherAndSubscribeHook);
              callback(null);
              break;
            }

          case 'do':
            {
              try {
                var _resource2 = resourcesService.getServiceResource(resourceName);

                logger.info('resource', {
                  type: type,
                  resourceName: resourceName,
                  value: value
                });
                _key2 = value[0], _params = value[1];
                var operation = _resource2.operations[_key2];

                if (!operation) {
                  throw new Error('Operation not found');
                }

                operation(_params, socket.user).then(function (result) {
                  return callback(null, result);
                }, function (err) {
                  logger.error(type, {
                    err: err
                  });
                  callback(err.message);
                });
              } catch (err) {
                logger.error(type, {
                  err: err
                });
                callback(err.message || err);
              }

              break;
            }

          default:
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

        }
      } catch (err) {
        logger.warn('rest error', {
          err: err
        });
        callback(err.message || err);
      }
    });
  });
}

exports.default = init;
//# sourceMappingURL=index-browser.cjs.js.map
