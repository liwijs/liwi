'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _rethinkdbdash = require('rethinkdbdash');

var _rethinkdbdash2 = _interopRequireDefault(_rethinkdbdash);

var _AbstractConnection = require('../store/AbstractConnection');

var _AbstractConnection2 = _interopRequireDefault(_AbstractConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('liwi:mongo:RethinkConnection');

class RethinkConnection extends _AbstractConnection2.default {

  constructor(config) {
    super();

    if (!config.has('host')) {
      config.set('host', 'localhost');
    }
    if (!config.has('port')) {
      config.set('port', '28015');
    }
    if (!config.has('database')) {
      throw new Error('Missing config database');
    }

    this.connect({
      host: config.get('host'),
      port: config.get('port'),
      db: config.get('database')
    });
  }

  connect(options) {
    logger.info('connecting', options);

    this._connection = (0, _rethinkdbdash2.default)(_extends({}, options, {
      buffer: 20,
      max: 100
    }));

    this._connection.getPoolMaster().on('healthy', healthy => {
      if (healthy === true) {
        this.getConnection = () => Promise.resolve(this._connection);
        logger.info('healthy');
      } else {
        this.getConnection = () => Promise.reject(new Error('Connection not healthy'));
        logger.warn('not healthy');
      }
    });

    this.getConnection = () => Promise.resolve(this._connection);
  }

  getConnection() {
    throw new Error('call connect()');
  }

  close() {
    this.getConnection = () => Promise.reject(new Error('Connection closed'));
    if (this._connection) {
      return this._connection.getPoolMaster().drain().then(() => {
        logger.info('connection closed');
        this._connection = null;
      });
    } else if (this._connecting) {
      return this.getConnection().then(() => this.close());
    }
  }
}
exports.default = RethinkConnection;
//# sourceMappingURL=RethinkConnection.js.map