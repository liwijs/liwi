var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Logger from 'nightingale-logger';
import { MongoClient } from 'mongodb';
import Db from 'mongodb/lib/db';
import AbstractConnection from '../store/AbstractConnection';

var logger = new Logger('liwi.mongo.MongoConnection');

var MongoConnection = function (_AbstractConnection) {
  _inherits(MongoConnection, _AbstractConnection);

  function MongoConnection(config) {
    _classCallCheck(this, MongoConnection);

    if (!(config instanceof Map)) {
      throw new TypeError('Value of argument "config" violates contract.\n\nExpected:\nMap\n\nGot:\n' + _inspect(config));
    }

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MongoConnection).call(this));

    if (!config.has('host')) {
      config.set('host', 'localhost');
    }
    if (!config.has('port')) {
      config.set('port', '27017');
    }
    if (!config.has('database')) {
      throw new Error('Missing config database');
    }

    var connectionString = 'mongodb://' + (config.has('user') ? config.get('user') + ':' + config.get('password') + '@' : '') + (config.get('host') + ':' + config.get('port') + '/' + config.get('database'));

    _this.connect(connectionString);
    return _this;
  }

  _createClass(MongoConnection, [{
    key: 'connect',
    value: function connect(connectionString) {
      var _this2 = this;

      logger.info('connecting', { connectionString: connectionString });

      var connectPromise = MongoClient.connect(connectionString).then(function (connection) {
        logger.info('connected', { connectionString: connectionString });
        connection.on('close', function () {
          logger.warn('close', { connectionString: connectionString });
          _this2.connectionFailed = true;
          _this2.getConnection = function () {
            return Promise.reject(new Error('MongoDB connection closed'));
          };

          if (!(typeof _this2.getConnection === 'function')) {
            throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(_this2.getConnection));
          }
        });
        connection.on('timeout', function () {
          logger.warn('timeout', { connectionString: connectionString });
          _this2.connectionFailed = true;
          _this2.getConnection = function () {
            return Promise.reject(new Error('MongoDB connection timeout'));
          };

          if (!(typeof _this2.getConnection === 'function')) {
            throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(_this2.getConnection));
          }
        });
        connection.on('reconnect', function () {
          logger.warn('reconnect', { connectionString: connectionString });
          _this2.connectionFailed = false;
          _this2.getConnection = function () {
            return Promise.resolve(_this2._connection);
          };

          if (!(typeof _this2.getConnection === 'function')) {
            throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(_this2.getConnection));
          }
        });
        connection.on('error', function (err) {
          logger.warn('error', { connectionString: connectionString, err: err });
        });

        _this2._connection = connection;

        if (!(_this2._connection instanceof Db || _this2._connection == null)) {
          throw new TypeError('Value of "this._connection" violates contract.\n\nExpected:\nDb | null\n\nGot:\n' + _inspect(_this2._connection));
        }

        _this2._connecting = null;

        if (!(_this2._connecting instanceof Promise || _this2._connecting == null)) {
          throw new TypeError('Value of "this._connecting" violates contract.\n\nExpected:\nPromise | null\n\nGot:\n' + _inspect(_this2._connecting));
        }

        _this2.getConnection = function () {
          return Promise.resolve(_this2._connection);
        };

        if (!(typeof _this2.getConnection === 'function')) {
          throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(_this2.getConnection));
        }

        return connection;
      }).catch(function (err) {
        logger.info('not connected', { connectionString: connectionString });
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

      if (!(typeof this.getConnection === 'function')) {
        throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(this.getConnection));
      }

      this._connecting = this.getConnection();

      if (!(this._connecting instanceof Promise || this._connecting == null)) {
        throw new TypeError('Value of "this._connecting" violates contract.\n\nExpected:\nPromise | null\n\nGot:\n' + _inspect(this._connecting));
      }
    }
  }, {
    key: 'getConnection',
    value: function getConnection() {
      throw new Error('call connect()');
    }
  }, {
    key: 'close',
    value: function close() {
      var _this3 = this;

      this.getConnection = function () {
        return Promise.reject(new Error('Connection closed'));
      };

      if (!(typeof this.getConnection === 'function')) {
        throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(this.getConnection));
      }

      if (this._connection) {
        return this._connection.close();
      } else if (this._connecting) {
        return this._connecting.then(function () {
          return _this3.close();
        });
      }
    }
  }]);

  return MongoConnection;
}(AbstractConnection);

export default MongoConnection;

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
    return typeof input === 'undefined' ? 'undefined' : _typeof(input);
  } else if (Array.isArray(input)) {
    if (input.length > 0) {
      var _ret = function () {
        if (depth > maxDepth) return {
            v: '[...]'
          };

        var first = _inspect(input[0], depth);

        if (input.every(function (item) {
          return _inspect(item, depth) === first;
        })) {
          return {
            v: first.trim() + '[]'
          };
        } else {
          return {
            v: '[' + input.slice(0, maxKeys).map(function (item) {
              return _inspect(item, depth);
            }).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
          };
        }
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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
    var entries = keys.slice(0, maxKeys).map(function (key) {
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