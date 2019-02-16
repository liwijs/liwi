import Logger from 'nightingale-logger';
import { decode, encode } from 'extended-json';

/* eslint-disable complexity */
const logger = new Logger('liwi:rest-websocket');
function init(io, resourcesService) {
  io.on('connection', socket => {
    const openWatchers = new Map();

    const unsubscribeWatcher = ({
      watcher,
      subscribeHook
    }) => {
      watcher.stop();

      if (subscribeHook) {
        subscribeHook.unsubscribed(socket.user);
      }
    };

    socket.on('disconnect', () => {
      openWatchers.forEach(unsubscribeWatcher);
    });
    socket.on('resource', ({
      type,
      resourceName,
      json
    }, callback) => {
      try {
        const value = json && decode(json);

        switch (type) {
          case 'cursor toArray':
            {
              const resource = resourcesService.getCursorResource(resourceName);
              resourcesService.createCursor(resource, socket.user, value).then(cursor => cursor.toArray()).then(results => callback(null, encode(results))).catch(err => {
                logger.error(type, err);
                callback(err.message);
              });
              break;
            }

          case 'fetch':
          case 'subscribe':
          case 'fetchAndSubscribe':
            try {
              const resource = resourcesService.getServiceResource(resourceName);
              logger.info('resource', {
                type,
                resourceName,
                value
              });
              const [key, params, eventName] = value;

              if (!key.startsWith('query')) {
                throw new Error('Invalid query key');
              }

              const query = resource.queries[key](params, socket.user);

              if (type === 'fetch') {
                query.fetch(result => callback(null, result && encode(result))).catch(err => {
                  logger.error(type, {
                    err
                  });
                  callback(err.message || err);
                });
              } else {
                const watcherKey = `${resourceName}__${key}`;

                if (openWatchers.has(watcherKey)) {
                  logger.warn('Already have a watcher for this key. Cannot add a new one', {
                    watcherKey,
                    key
                  });
                  callback('Already have a watcher for this key. Cannot add a new one');
                  return;
                }

                const watcher = query[type]((err, result) => {
                  if (err) {
                    logger.error(type, {
                      err
                    });
                  }

                  socket.emit(eventName, err, result && encode(result));
                });
                watcher.then(() => callback(null), err => {
                  logger.error(type, {
                    err
                  });
                  callback(err.message);
                });
                const subscribeHook = resource.subscribeHooks && resource.subscribeHooks[key];
                openWatchers.set(watcherKey, {
                  watcher,
                  subscribeHook
                });

                if (subscribeHook) {
                  subscribeHook.subscribed(socket.user);
                }
              }
            } catch (err) {
              logger.error(type, {
                err
              });
              callback(err.message || err);
            }

            break;

          case 'unsubscribe':
            {
              const [key] = value;
              const watcherKey = `${resourceName}__${key}`;
              const watcherAndSubscribeHook = openWatchers.get(watcherKey);

              if (!watcherAndSubscribeHook) {
                logger.warn('tried to unsubscribe non existing watcher', {
                  key
                });
                return;
              }

              openWatchers.delete(watcherKey);
              unsubscribeWatcher(watcherAndSubscribeHook);
              break;
            }

          case 'do':
            {
              try {
                const resource = resourcesService.getServiceResource(resourceName);
                logger.info('resource', {
                  type,
                  resourceName,
                  value
                });
                const [key, params] = value;
                const operation = resource.operations[key];

                if (!operation) {
                  throw new Error('Operation not found');
                }

                operation(params, socket.user).then(result => callback(null, result), err => {
                  logger.error(type, {
                    err
                  });
                  callback(err.message);
                });
              } catch (err) {
                logger.error(type, {
                  err
                });
                callback(err.message || err);
              }

              break;
            }

          default:
            try {
              logger.warn('Unknown command', {
                type
              });
              callback(`rest: unknown command "${type}"`);
            } catch (err) {
              logger.error(type, {
                err
              });
              callback(err.message || err);
            }

        }
      } catch (err) {
        logger.warn('rest error', {
          err
        });
        callback(err.message || err);
      }
    });
  });
}

export default init;
//# sourceMappingURL=index-node10.es.js.map
