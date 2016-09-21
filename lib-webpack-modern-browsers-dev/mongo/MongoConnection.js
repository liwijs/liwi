import _t from 'tcomb-forked';
import Logger from 'nightingale-logger';
import { MongoClient } from 'mongodb';
import Db from 'mongodb/lib/db';
import AbstractConnection from '../store/AbstractConnection';

var logger = new Logger('liwi.mongo.MongoConnection');

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
    logger.info('connecting', { connectionString });

    var connectPromise = MongoClient.connect(connectionString).then(connection => {
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
    return _assert(function () {
      throw new Error('call connect()');
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  close() {
    this.getConnection = () => Promise.reject(new Error('Connection closed'));
    if (this._connection) {
      return this._connection.close();
    } else if (this._connecting) {
      return this._connecting.then(() => this.close());
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

    return type(x);
  }

  if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=MongoConnection.js.map