import Logger from 'nightingale-logger';
import { MongoClient } from 'mongodb';
import Db from 'mongodb/lib/db';
import AbstractConnection from '../store/AbstractConnection';

var logger = new Logger('liwi.mongo.MongoConnection');

export default class MongoConnection extends AbstractConnection {

  constructor(config) {
    if (!(config instanceof Map)) {
      throw new TypeError('Value of argument "config" violates contract.\n\nExpected:\nMap\n\nGot:\n' + _inspect(config));
    }

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
        this.getConnection = () => {
          return Promise.reject(new Error('MongoDB connection closed'));
        };

        if (!(typeof this.getConnection === 'function')) {
          throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(this.getConnection));
        }
      });
      connection.on('timeout', () => {
        logger.warn('timeout', { connectionString });
        this.connectionFailed = true;
        this.getConnection = () => {
          return Promise.reject(new Error('MongoDB connection timeout'));
        };

        if (!(typeof this.getConnection === 'function')) {
          throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(this.getConnection));
        }
      });
      connection.on('reconnect', () => {
        logger.warn('reconnect', { connectionString });
        this.connectionFailed = false;
        this.getConnection = () => {
          return Promise.resolve(this._connection);
        };

        if (!(typeof this.getConnection === 'function')) {
          throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(this.getConnection));
        }
      });
      connection.on('error', err => {
        logger.warn('error', { connectionString, err });
      });

      this._connection = connection;

      if (!(this._connection instanceof Db || this._connection == null)) {
        throw new TypeError('Value of "this._connection" violates contract.\n\nExpected:\nDb | null\n\nGot:\n' + _inspect(this._connection));
      }

      this._connecting = null;

      if (!(this._connecting instanceof Promise || this._connecting == null)) {
        throw new TypeError('Value of "this._connecting" violates contract.\n\nExpected:\nPromise | null\n\nGot:\n' + _inspect(this._connecting));
      }

      this.getConnection = () => {
        return Promise.resolve(this._connection);
      };

      if (!(typeof this.getConnection === 'function')) {
        throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(this.getConnection));
      }

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

    this.getConnection = () => {
      return Promise.resolve(connectPromise);
    };

    if (!(typeof this.getConnection === 'function')) {
      throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(this.getConnection));
    }

    this._connecting = this.getConnection();

    if (!(this._connecting instanceof Promise || this._connecting == null)) {
      throw new TypeError('Value of "this._connecting" violates contract.\n\nExpected:\nPromise | null\n\nGot:\n' + _inspect(this._connecting));
    }
  }

  getConnection() {
    throw new Error('call connect()');
  }

  close() {
    this.getConnection = () => {
      return Promise.reject(new Error('Connection closed'));
    };

    if (!(typeof this.getConnection === 'function')) {
      throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(this.getConnection));
    }

    if (this._connection) {
      return this._connection.close();
    } else if (this._connecting) {
      return this._connecting.then(() => {
        return this.close();
      });
    }
  }
}

function _inspect(input, depth) {
  var maxDepth = 4;
  var maxKeys = 15;

  if (depth === undefined) {
    depth = 0;
  }

  depth += 1;

  if (input === null) {
    return 'null';
  } else if (input === undefined) {
    return 'void';
  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return typeof input;
  } else if (Array.isArray(input)) {
    if (input.length > 0) {
      var _ret = function () {
        if (depth > maxDepth) return {
            v: '[...]'
          };

        var first = _inspect(input[0], depth);

        if (input.every(item => _inspect(item, depth) === first)) {
          return {
            v: first.trim() + '[]'
          };
        } else {
          return {
            v: '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
          };
        }
      }();

      if (typeof _ret === "object") return _ret.v;
    } else {
      return 'Array';
    }
  } else {
    var keys = Object.keys(input);

    if (!keys.length) {
      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
        return input.constructor.name;
      } else {
        return 'Object';
      }
    }

    if (depth > maxDepth) return '{...}';
    var indent = '  '.repeat(depth - 1);
    var entries = keys.slice(0, maxKeys).map(key => {
      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
    }).join('\n  ' + indent);

    if (keys.length >= maxKeys) {
      entries += '\n  ' + indent + '...';
    }

    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
      return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
    } else {
      return '{\n  ' + indent + entries + '\n' + indent + '}';
    }
  }
}
//# sourceMappingURL=MongoConnection.js.map