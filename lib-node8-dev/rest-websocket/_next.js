'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MAX_OPENED_CURSORS = 5;
const logger = new _nightingaleLogger2.default('liwi:rest-websocket');

function init(io, restService) {
  io.on('connection', socket => {
    let openCursors = new Map();
    let timeouts = new Map();
    let activeListeners = new Map();

    const closeCursor = id => {
      clearTimeout(timeouts[id]), timeouts.delete(id), openCursors[id].close(), openCursors.delete(id);
    };

    socket.on('disconnect', () => {
      openCursors.forEach(cursor => cursor.close()), timeouts.forEach(timeout => clearTimeout(timeout)), activeListeners.forEach(listener => listener.close()), openCursors = null, timeouts = null, activeListeners = null;
    });


    let nextIdCursor = 1;

    socket.on('rest', (_arg, args, callback) => {
      let _argsType = _flowRuntime2.default.array(_flowRuntime2.default.any());

      let _callbackType = _flowRuntime2.default.function();

      _flowRuntime2.default.param('args', _argsType).assert(args), _flowRuntime2.default.param('callback', _callbackType).assert(callback);

      let { type, restName } = _flowRuntime2.default.object(_flowRuntime2.default.property('type', _flowRuntime2.default.string()), _flowRuntime2.default.property('restName', _flowRuntime2.default.string())).assert(_arg);

      switch (logger.info('rest', { type, restName, args }), type) {
        case 'createCursor':
          {
            if (openCursors.size > MAX_OPENED_CURSORS) return callback('too many cursors');

            const id = nextIdCursor++;
            const [options] = args;
            const cursor = restService.createCursor(restName, options);
            return cursor ? (timeouts.set(id, setTimeout(() => {
              logger.warn('socket closed by timeout', { id, restName }), closeCursor(id);
            })), callback(null, id)) : callback('failed to create cursor');
          }

        case 'cursor toArray':
          {
            const [options] = args;
            return restService.createCursor(restName, options).then(cursor => cursor.toArray()).then(results => callback(null, results)).catch(err => callback(err.message));
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
                return cursor[type](...cursorArgs).then(result => callback(null, result)).catch(err => callback(err.message || err));
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
          return restService[type](restName, ...args).then(result => callback(null, result)).catch(err => callback(err.message || err));

        default:
          callback(`Unknown command: "${type}"`);

      }
    });
  });
}
//# sourceMappingURL=_next.js.map