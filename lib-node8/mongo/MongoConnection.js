'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _mongodb = require('mongodb');

var _AbstractConnection = require('../store/AbstractConnection');

var _AbstractConnection2 = _interopRequireDefault(_AbstractConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('liwi:mongo:MongoConnection');

let MongoConnection = class extends _AbstractConnection2.default {

  constructor(config) {
    if (super(), config.has('host') || config.set('host', 'localhost'), config.has('port') || config.set('port', '27017'), !config.has('database')) throw new Error('Missing config database');

    const connectionString = `mongodb://${config.has('user') ? `${config.get('user')}:${config.get('password')}@` : ''}` + `${config.get('host')}:${config.get('port')}/${config.get('database')}`;

    this.connect(connectionString);
  }

  connect(connectionString) {
    logger.info('connecting', { connectionString });


    const connectPromise = _mongodb.MongoClient.connect(connectionString).then(connection => (logger.info('connected', { connectionString }), connection.on('close', () => {
      logger.warn('close', { connectionString }), this.connectionFailed = true, this.getConnection = () => Promise.reject(new Error('MongoDB connection closed'));
    }), connection.on('timeout', () => {
      logger.warn('timeout', { connectionString }), this.connectionFailed = true, this.getConnection = () => Promise.reject(new Error('MongoDB connection timeout'));
    }), connection.on('reconnect', () => {
      logger.warn('reconnect', { connectionString }), this.connectionFailed = false, this.getConnection = () => Promise.resolve(this._connection);
    }), connection.on('error', err => {
      logger.warn('error', { connectionString, err });
    }), this._connection = connection, this._connecting = null, this.getConnection = () => Promise.resolve(this._connection), connection)).catch(err => {

      throw logger.info('not connected', { connectionString }), console.error(err.message || err), process.nextTick(() => {
        process.exit(1);
      }), err;
    });

    this.getConnection = () => Promise.resolve(connectPromise), this._connecting = this.getConnection();
  }

  getConnection() {
    throw new Error('call connect()');
  }

  close() {
    return (this.getConnection = () => Promise.reject(new Error('Connection closed')), this._connection) ? this._connection.close().then(() => {
      this._connection = null;
    }) : this._connecting ? this._connecting.then(() => this.close()) : void 0;
  }
};
exports.default = MongoConnection;
//# sourceMappingURL=MongoConnection.js.map