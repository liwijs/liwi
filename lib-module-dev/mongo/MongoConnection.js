var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _possibleConstructorReturn(self, call) { if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass); }

import Logger from 'nightingale-logger';
import { MongoClient } from 'mongodb';
import Db from 'mongodb/lib/db';
import AbstractConnection from '../store/AbstractConnection';

import t from 'flow-runtime';
var logger = new Logger('liwi:mongo:MongoConnection');

var MongoConnection = function (_AbstractConnection) {
  function MongoConnection(config) {
    _classCallCheck(this, MongoConnection);

    var _configType = t.ref('Map', t.string(), t.union(t.string(), t.number()));

    t.param('config', _configType).assert(config);

    var _this = _possibleConstructorReturn(this, (MongoConnection.__proto__ || Object.getPrototypeOf(MongoConnection)).call(this));

    if (config.has('host') || config.set('host', 'localhost'), config.has('port') || config.set('port', '27017'), !config.has('database')) throw new Error('Missing config database');

    var connectionString = 'mongodb://' + (config.has('user') ? config.get('user') + ':' + config.get('password') + '@' : '') + (config.get('host') + ':' + config.get('port') + '/' + config.get('database'));

    return _this.connect(connectionString), _this.connect(connectionString), _this;
  }

  return _inherits(MongoConnection, _AbstractConnection), _createClass(MongoConnection, [{
    key: 'connect',
    value: function connect(connectionString) {
      var _this2 = this;

      logger.info('connecting', { connectionString: connectionString });


      var connectPromise = MongoClient.connect(connectionString).then(function (connection) {
        return logger.info('connected', { connectionString: connectionString }), connection.on('close', function () {
          logger.warn('close', { connectionString: connectionString }), _this2.connectionFailed = true, _this2.getConnection = function () {
            return Promise.reject(new Error('MongoDB connection closed'));
          };
        }), connection.on('timeout', function () {
          logger.warn('timeout', { connectionString: connectionString }), _this2.connectionFailed = true, _this2.getConnection = function () {
            return Promise.reject(new Error('MongoDB connection timeout'));
          };
        }), connection.on('reconnect', function () {
          logger.warn('reconnect', { connectionString: connectionString }), _this2.connectionFailed = false, _this2.getConnection = function () {
            return Promise.resolve(_this2._connection);
          };
        }), connection.on('error', function (err) {
          logger.warn('error', { connectionString: connectionString, err: err });
        }), _this2._connection = connection, _this2._connecting = null, _this2.getConnection = function () {
          return Promise.resolve(_this2._connection);
        }, connection;
      }).catch(function (err) {

        throw logger.info('not connected', { connectionString: connectionString }), console.error(err.message || err), process.nextTick(function () {
          process.exit(1);
        }), err;
      });

      this.getConnection = function () {
        return Promise.resolve(connectPromise);
      }, this._connecting = this.getConnection();
    }
  }, {
    key: 'getConnection',
    value: function getConnection() {
      t.return(t.ref(Db));

      throw new Error('call connect()');
    }
  }, {
    key: 'close',
    value: function close() {
      var _this3 = this;

      return (this.getConnection = function () {
        return Promise.reject(new Error('Connection closed'));
      }, this._connection) ? this._connection.close().then(function () {
        _this3._connection = null;
      }) : this._connecting ? this._connecting.then(function () {
        return _this3.close();
      }) : void 0;
    }
  }]), MongoConnection;
}(AbstractConnection);

export { MongoConnection as default };
//# sourceMappingURL=MongoConnection.js.map