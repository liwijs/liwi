var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import _t from 'tcomb-forked';
/* global PRODUCTION */
import Logger from 'nightingale-logger';
import { encode, decode } from '../msgpack';

var logger = new Logger('liwi.rest-websocket');

var ObjectBufferType = _t.interface({
  type: _t.enums.of(['Buffer']),
  data: _t.list(_t.Number)
}, 'ObjectBufferType');

export default function init(io, restService) {
  io.on('connection', socket => {
    socket.on('rest', (_ref, args, callback) => {
      var type = _ref.type;
      var restName = _ref.restName;
      var buffer = _ref.buffer;

      _assert({
        type,
        restName,
        buffer
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
        console.log(args);
      }

      if (!callback) {
        throw new Error('`callback` missing.');
      }

      logger.info('rest', { type, restName, args });
      switch (type) {
        case 'cursor toArray':
          {
            var _args = args;

            var _args2 = _slicedToArray(_args, 1);

            var options = _args2[0];

            return restService.createCursor(restName, socket.user, options).then(cursor => cursor.toArray()).then(results => callback(null, encode(results))).catch(err => {
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
            var restResource = restService.get(restName);
            if (!restResource[type]) {
              throw new Error(`rest: ${ restName }.${ type } is not available`);
            }

            return restResource[type](socket.user, ...args).then(result => callback(null, encode(result))).catch(err => {
              logger.error(type, { err });
              callback(err.message || err);
            });
          } catch (err) {
            logger.error(type, { err });
            callback(err.message || err);
          }
          break;

        case 'query:fetch':
        case 'query:subscribe':
          if (type === 'query:fetch') {
            type = 'fetch';
          }
          if (type === 'query:subscribe') {
            type = 'subscribe';
          }

          try {
            var _restResource = restService.get(restName);
            var key = args[0];

            var query = _restResource.query(socket.user, ...args);
            if (!query) {
              throw new Error(`rest: ${ restName }.${ type }.${ key } is not available`);
            }

            if (type === 'fetch') {
              return query[type](result => callback(null, encode(result))).catch(err => {
                logger.error(type, { err });
                callback(err.message || err);
              });
            } else {
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
              callback(null, 'coucou');
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
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }

    return type(x);
  }

  if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=index.js.map