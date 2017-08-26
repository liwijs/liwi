'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _mongodb = require('mongodb');

var _db = require('mongodb/lib/db');

var _db2 = _interopRequireDefault(_db);

var _AbstractConnection = require('../store/AbstractConnection');

var _AbstractConnection2 = _interopRequireDefault(_AbstractConnection);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('liwi:mongo:MongoConnection');

let MongoConnection = class extends _AbstractConnection2.default {

  constructor(config) {
    let _configType = _flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.union(_flowRuntime2.default.string(), _flowRuntime2.default.number()));

    _flowRuntime2.default.param('config', _configType).assert(config);

    super();

    if (!config.has('host')) {
      config.set('host', 'localhost');
    }
    if (!config.has('port')) {
      config.set('port', '27017');
    }
    if (!config.has('database')) {
      throw new Error('Missing config database');
    }

    const connectionString = `mongodb://${config.has('user') ? `${config.get('user')}:${config.get('password')}@` : ''}` + `${config.get('host')}:${config.get('port')}/${config.get('database')}`;

    this.connect(connectionString);
  }

  connect(connectionString) {
    logger.info('connecting', { connectionString });

    const connectPromise = _mongodb.MongoClient.connect(connectionString).then(connection => {
      logger.info('connected', { connectionString });
      connection.on('close', () => {
        logger.warn('close', { connectionString });
        this.connectionFailed = true;
        this.getConnection = () => Promise.reject(new Error('MongoDB connection closed'));
      });
      connection.on('timeout', () => {
        logger.warn('timeout', { connectionString });
        this.connectionFailed = true;
        this.getConnection = () => Promise.reject(new Error('MongoDB connection timeout'));
      });
      connection.on('reconnect', () => {
        logger.warn('reconnect', { connectionString });
        this.connectionFailed = false;
        this.getConnection = () => Promise.resolve(this._connection);
      });
      connection.on('error', err => {
        logger.warn('error', { connectionString, err });
      });

      this._connection = connection;
      this._connecting = null;
      this.getConnection = () => Promise.resolve(this._connection);
      return connection;
    }).catch(err => {
      logger.info('not connected', { connectionString });
      console.error(err.message || err);
      // throw err;
      process.nextTick(() => {
        process.exit(1);
      });

      throw err;
    });

    this.getConnection = () => Promise.resolve(connectPromise);
    this._connecting = this.getConnection();
  }

  getConnection() {
    _flowRuntime2.default.return(_flowRuntime2.default.ref(_db2.default));

    throw new Error('call connect()');
  }

  close() {
    this.getConnection = () => Promise.reject(new Error('Connection closed'));
    if (this._connection) {
      return this._connection.close().then(() => {
        this._connection = null;
      });
    } else if (this._connecting) {
      return this._connecting.then(() => this.close());
    }
  }
};
exports.default = MongoConnection;
//# sourceMappingURL=MongoConnection.js.map