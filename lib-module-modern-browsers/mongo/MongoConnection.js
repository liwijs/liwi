import Logger from 'nightingale-logger';
import { MongoClient } from 'mongodb';

import AbstractConnection from '../store/AbstractConnection';

const logger = new Logger('liwi:mongo:MongoConnection');

let MongoConnection = class extends AbstractConnection {

  constructor(config) {
    if (super(), config.has('host') || config.set('host', 'localhost'), config.has('port') || config.set('port', '27017'), !config.has('database')) throw new Error('Missing config database');

    const connectionString = `mongodb://${config.has('user') ? `${config.get('user')}:${config.get('password')}@` : ''}` + `${config.get('host')}:${config.get('port')}/${config.get('database')}`;

    this.connect(connectionString);
  }

  connect(connectionString) {
    var _this = this;

    logger.info('connecting', { connectionString });


    const connectPromise = MongoClient.connect(connectionString).then(function (connection) {
      return logger.info('connected', { connectionString }), connection.on('close', function () {
        logger.warn('close', { connectionString }), _this.connectionFailed = true, _this.getConnection = function () {
          return Promise.reject(new Error('MongoDB connection closed'));
        };
      }), connection.on('timeout', function () {
        logger.warn('timeout', { connectionString }), _this.connectionFailed = true, _this.getConnection = function () {
          return Promise.reject(new Error('MongoDB connection timeout'));
        };
      }), connection.on('reconnect', function () {
        logger.warn('reconnect', { connectionString }), _this.connectionFailed = false, _this.getConnection = function () {
          return Promise.resolve(_this._connection);
        };
      }), connection.on('error', function (err) {
        logger.warn('error', { connectionString, err });
      }), _this._connection = connection, _this._connecting = null, _this.getConnection = function () {
        return Promise.resolve(_this._connection);
      }, connection;
    }).catch(function (err) {

      throw logger.info('not connected', { connectionString }), console.error(err.message || err), process.nextTick(function () {
        process.exit(1);
      }), err;
    });

    this.getConnection = function () {
      return Promise.resolve(connectPromise);
    }, this._connecting = this.getConnection();
  }

  getConnection() {
    throw new Error('call connect()');
  }

  close() {
    var _this2 = this;

    return (this.getConnection = function () {
      return Promise.reject(new Error('Connection closed'));
    }, this._connection) ? this._connection.close().then(function () {
      _this2._connection = null;
    }) : this._connecting ? this._connecting.then(function () {
      return _this2.close();
    }) : void 0;
  }
};
export { MongoConnection as default };
//# sourceMappingURL=MongoConnection.js.map