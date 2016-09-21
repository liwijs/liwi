'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* global PRODUCTION */


exports.default = init;

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _msgpack = require('../msgpack');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('liwi.rest-websocket');

function init(io, restService) {
  io.on('connection', socket => {
    socket.on('rest', (_ref, args, callback) => {
      let type = _ref.type;
      let restName = _ref.restName;
      let buffer = _ref.buffer;

      if (buffer) {

        callback = args;
        args = (0, _msgpack.decode)(buffer);
        console.log(args);
      }

      logger.info('rest', { type, restName, args });
      switch (type) {
        case 'cursor toArray':
          {
            var _args = args;

            var _args2 = _slicedToArray(_args, 1);

            const options = _args2[0];

            return restService.createCursor(restName, socket.user, options).then(cursor => cursor.toArray()).then(results => callback(null, (0, _msgpack.encode)(results))).catch(err => {
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
            const restResource = restService.get(restName);


            return restResource[type](socket.user, ...args).then(result => callback(null, (0, _msgpack.encode)(result))).catch(err => {
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
            const restResource = restService.get(restName);
            const key = args[0];

            const query = restResource.query(socket.user, ...args);
            if (!query) {
              throw new Error(`rest: ${ restName }.${ type }.${ key } is not available`);
            }

            if (type === 'fetch') {
              return query[type](result => callback(null, (0, _msgpack.encode)(result))).catch(err => {
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
//# sourceMappingURL=index.js.map