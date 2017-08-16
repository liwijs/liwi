import Logger from 'nightingale-logger';

import t from 'flow-runtime';
const MAX_OPENED_CURSORS = 5;
const logger = new Logger('liwi:rest-websocket');

export default function init(io, restService) {
  io.on('connection', function (socket) {
    let openCursors = new Map();
    let timeouts = new Map();
    let activeListeners = new Map();

    const closeCursor = function closeCursor(id) {
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


    let nextIdCursor = 1;

    socket.on('rest', function (_arg, args, callback) {
      let _argsType = t.array(t.any());

      let _callbackType = t.function();

      t.param('args', _argsType).assert(args), t.param('callback', _callbackType).assert(callback);
      let { type, restName } = t.object(t.property('type', t.string()), t.property('restName', t.string())).assert(_arg);

      switch (logger.info('rest', { type, restName, args }), type) {
        case 'createCursor':
          {
            if (openCursors.size > MAX_OPENED_CURSORS) return callback('too many cursors');

            const id = nextIdCursor++;
            const [options] = args;
            const cursor = restService.createCursor(restName, options);
            return cursor ? (timeouts.set(id, setTimeout(function () {
              logger.warn('socket closed by timeout', { id, restName }), closeCursor(id);
            })), callback(null, id)) : callback('failed to create cursor');
          }

        case 'cursor toArray':
          {
            const [options] = args;
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
            const [{ type: typeCursorAction, id: idCursor }, cursorArgs] = args;

            const cursor = openCursors.get(idCursor);
            if (!cursor) return callback(`failed to find cursor "${idCursor}"`);
            switch (typeCursorAction) {
              case 'close':
                return closeCursor(idCursor), callback();

              case 'advance':
              case 'next':
              case 'count':
                // eslint-disable-next-line prettier/prettier
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
                callback(`Unknown command: "${type}"`);

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
          return restService[type](restName, ...args).then(function (result) {
            return callback(null, result);
          }).catch(function (err) {
            return callback(err.message || err);
          });

        default:
          callback(`Unknown command: "${type}"`);

      }
    });
  });
}
//# sourceMappingURL=_next.js.map