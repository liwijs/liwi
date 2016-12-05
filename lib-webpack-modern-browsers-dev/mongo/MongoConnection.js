import _t from 'tcomb-forked';
import Logger from 'nightingale-logger';
import { MongoClient } from 'mongodb';

import AbstractConnection from '../store/AbstractConnection';

var logger = new Logger('liwi:mongo:MongoConnection');

export default class MongoConnection extends AbstractConnection {

  constructor(config) {
    _assert(config, Map, 'config');

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

    var connectionString = `mongodb://${ config.has('user') ? `${ config.get('user') }:${ config.get('password') }@` : '' }` + `${ config.get('host') }:${ config.get('port') }/${ config.get('database') }`;

    this.connect(connectionString);
  }

  connect(connectionString) {
    var _this = this;

    logger.info('connecting', { connectionString });

    var connectPromise = MongoClient.connect(connectionString).then(function (connection) {
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
    return _assert(function () {
      throw new Error('call connect()');
    }.apply(this, arguments), _t.Promise, 'return value');
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
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=MongoConnection.js.map