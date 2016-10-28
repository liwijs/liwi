var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _t from 'tcomb-forked';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Logger from 'nightingale-logger';
import { MongoClient } from 'mongodb';

import AbstractConnection from '../store/AbstractConnection';

var logger = new Logger('liwi:mongo:MongoConnection');

var MongoConnection = function (_AbstractConnection) {
  _inherits(MongoConnection, _AbstractConnection);

  function MongoConnection(config) {
    _assert(config, Map, 'config');

    _classCallCheck(this, MongoConnection);

    var _this = _possibleConstructorReturn(this, (MongoConnection.__proto__ || Object.getPrototypeOf(MongoConnection)).call(this));

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
        });
        connection.on('timeout', function () {
          logger.warn('timeout', { connectionString: connectionString });
          _this2.connectionFailed = true;
          _this2.getConnection = function () {
            return Promise.reject(new Error('MongoDB connection timeout'));
          };
        });
        connection.on('reconnect', function () {
          logger.warn('reconnect', { connectionString: connectionString });
          _this2.connectionFailed = false;
          _this2.getConnection = function () {
            return Promise.resolve(_this2._connection);
          };
        });
        connection.on('error', function (err) {
          logger.warn('error', { connectionString: connectionString, err: err });
        });

        _this2._connection = connection;
        _this2._connecting = null;
        _this2.getConnection = function () {
          return Promise.resolve(_this2._connection);
        };
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
      this._connecting = this.getConnection();
    }
  }, {
    key: 'getConnection',
    value: function getConnection() {
      return _assert(function () {
        throw new Error('call connect()');
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'close',
    value: function close() {
      var _this3 = this;

      this.getConnection = function () {
        return Promise.reject(new Error('Connection closed'));
      };
      if (this._connection) {
        return this._connection.close().then(function () {
          _this3._connection = null;
        });
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