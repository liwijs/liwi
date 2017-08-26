import Logger from 'nightingale-logger';
import { MongoClient } from 'mongodb';

import AbstractConnection from '../store/AbstractConnection';

const logger = new Logger('liwi:mongo:MongoConnection');

let MongoConnection = class extends AbstractConnection {

  constructor(config) {
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
    var _this = this;

    logger.info('connecting', { connectionString });

    const connectPromise = MongoClient.connect(connectionString).then(function (connection) {
      logger.info('connected', { connectionString });
      connection.on('close', function () {
        logger.warn('close', { connectionString });
        _this.connectionFailed = true;
        _this.getConnection = function () {
          return Promise.reject(new Error('MongoDB connection closed'));
        };
      });
      connection.on('timeout', function () {
        logger.warn('timeout', { connectionString });
        _this.connectionFailed = true;
        _this.getConnection = function () {
          return Promise.reject(new Error('MongoDB connection timeout'));
        };
      });
      connection.on('reconnect', function () {
        logger.warn('reconnect', { connectionString });
        _this.connectionFailed = false;
        _this.getConnection = function () {
          return Promise.resolve(_this._connection);
        };
      });
      connection.on('error', function (err) {
        logger.warn('error', { connectionString, err });
      });

      _this._connection = connection;
      _this._connecting = null;
      _this.getConnection = function () {
        return Promise.resolve(_this._connection);
      };
      return connection;
    }).catch(function (err) {
      logger.info('not connected', { connectionString });
      console.error(err.message || err);
      // throw err;
      process.nextTick(function () {
        process.exit(1);
      });

      throw err;
    });

    this.getConnection = function () {
      return Promise.resolve(connectPromise);
    };
    this._connecting = this.getConnection();
  }

  getConnection() {
    throw new Error('call connect()');
  }

  close() {
    var _this2 = this;

    this.getConnection = function () {
      return Promise.reject(new Error('Connection closed'));
    };
    if (this._connection) {
      return this._connection.close().then(function () {
        _this2._connection = null;
      });
    } else if (this._connecting) {
      return this._connecting.then(function () {
        return _this2.close();
      });
    }
  }
};
export { MongoConnection as default };
//# sourceMappingURL=MongoConnection.js.map