'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _msgpack = require('../msgpack');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global PRODUCTION */
const logger = new _nightingaleLogger2.default('liwi:rest-websocket');

const ObjectBufferType = _tcombForked2.default.interface({
  type: _tcombForked2.default.enums.of(['Buffer']),
  data: _tcombForked2.default.list(_tcombForked2.default.Number)
}, 'ObjectBufferType');

function init(io, restService) {
  io.on('connection', socket => {
    let openWatchers = new Set();

    socket.on('disconnect', () => {
      openWatchers.forEach(watcher => watcher.stop());
    });

    socket.on('rest', ({ type, restName, buffer }, args, callback) => {
      _assert({
        type,
        restName,
        buffer
      }, _tcombForked2.default.interface({
        type: _tcombForked2.default.String,
        restName: _tcombForked2.default.String,
        buffer: _tcombForked2.default.maybe(ObjectBufferType)
      }), '{ type, restName, buffer }');

      _assert(args, _tcombForked2.default.union([_tcombForked2.default.maybe(_tcombForked2.default.list(_tcombForked2.default.Any)), _tcombForked2.default.Function]), 'args');

      _assert(callback, _tcombForked2.default.maybe(_tcombForked2.default.Function), 'callback');

      if (buffer) {
        if (callback) {
          throw new Error('Cannot have args and buffer.');
        }

        callback = args;
        args = (0, _msgpack.decode)(buffer);
      }

      if (!callback) {
        throw new Error('`callback` missing.');
      }

      const restResource = restService.get(restName);

      logger.info('rest', { type, restName, args });
      switch (type) {
        case 'cursor toArray':
          {
            const [options] = args;
            return restService.createCursor(restResource, socket.user, options).then(cursor => cursor.toArray()).then(results => callback(null, (0, _msgpack.encode)(results))).catch(err => {
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
              throw new Error(`rest: ${ restName }.${ type } is not available`);
            }

            return restResource[type](socket.user, ...args).then(result => callback(null, (0, _msgpack.encode)(result))).catch(err => {
              logger.error(type, { err });
              callback(err.message || err);
            });
          } catch (err) {
            logger.error(type, { err });
            callback(err.message || err);
          }
          break;

        case 'fetch':
        case 'subscribe':
        case 'fetchAndSubscribe':
          try {
            const [key, eventName, otherArgs = []] = args;

            if (!key.startsWith('query')) {
              throw new Error('Invalid query key');
            }

            const query = restResource.queries[key]; // todo pass connected user
            if (!query) {
              throw new Error(`rest: ${ restName }.${ type }.${ key } is not available`);
            }

            if (type === 'fetch') {
              return query[type](result => callback(null, (0, _msgpack.encode)(result)), ...otherArgs).catch(err => {
                logger.error(type, { err });
                callback(err.message || err);
              });
            } else {
              const watcher = query[type]((err, result) => {
                if (err) {
                  logger.error(type, { err });
                }
                socket.emit(eventName, err, (0, _msgpack.encode)(result));
              });
              watcher.then(() => callback(), err => {
                logger.error(type, { err });
                callback(err.message || err);
              });

              openWatchers.add(watcher);
            }
          } catch (err) {
            logger.error(type, { err });
            callback(err.message || err);
          }
          break;

        default:
          try {
            logger.warn('Unknown command', { type });
            callback(`rest: unknown command "${ type }"`);
          } catch (err) {
            logger.error(type, { err });
            callback(err.message || err);
          }
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
//# sourceMappingURL=index.js.map