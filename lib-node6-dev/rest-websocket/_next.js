'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MAX_OPENED_CURSORS = 5;
const logger = new _nightingaleLogger2.default('liwi:rest-websocket');

function init(io, restService) {
  io.on('connection', socket => {
    let openCursors = new Map();
    let timeouts = new Map();
    let activeListeners = new Map();

    const closeCursor = id => {
      clearTimeout(timeouts[id]);
      timeouts.delete(id);
      openCursors[id].close();
      openCursors.delete(id);
    };

    socket.on('disconnect', () => {
      openCursors.forEach(cursor => cursor.close());
      timeouts.forEach(timeout => clearTimeout(timeout));
      activeListeners.forEach(listener => listener.close());

      openCursors = timeouts = activeListeners = null;
    });

    let nextIdCursor = 1;

    socket.on('rest', ({ type, restName }, args, callback) => {
      _assert({
        type,
        restName
      }, _tcombForked2.default.interface({
        type: _tcombForked2.default.String,
        restName: _tcombForked2.default.String
      }), '{ type, restName }');

      _assert(args, _tcombForked2.default.list(_tcombForked2.default.Any), 'args');

      _assert(callback, _tcombForked2.default.Function, 'callback');

      logger.info('rest', { type, restName, args });
      switch (type) {
        case 'createCursor':
          {
            if (openCursors.size > MAX_OPENED_CURSORS) return callback('too many cursors');

            const id = nextIdCursor++;
            const [options] = args;
            const cursor = restService.createCursor(restName, options);
            if (!cursor) return callback('failed to create cursor');

            timeouts.set(id, setTimeout(() => {
              logger.warn('socket closed by timeout', { id, restName });
              closeCursor(id);
            }));

            return callback(null, id);
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
            if (!cursor) return callback(`failed to find cursor "${ idCursor }"`);
            switch (typeCursorAction) {
              case 'close':
                closeCursor(idCursor);
                return callback();

              case 'advance':
              case 'next':
              case 'count':
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
                callback(`Unknown command: "${ type }"`);
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
          return restService[type](restName, ...args).then(result => callback(null, result)).catch(err => callback(err.message || err));

        default:
          callback(`Unknown command: "${ type }"`);
      }
    });
  });
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=_next.js.map