var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['keys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['defineProperty'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper() {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import Logger from 'nightingale-logger';
import { MongoClient } from 'mongodb';
import Db from 'mongodb/lib/db';
import AbstractConnection from '../store/AbstractConnection';

import t from 'flow-runtime';
var logger = new Logger('liwi:mongo:MongoConnection');

var MongoConnection = (_dec = t.decorate(function () {
  return t.union(t.ref(Db), t.null());
}), _dec2 = t.decorate(t.union(t.ref('Promise', t.void()), t.null())), _dec3 = t.decorate(t.boolean()), (_class = function (_AbstractConnection) {
  _inherits(MongoConnection, _AbstractConnection);

  function MongoConnection(config) {
    _classCallCheck(this, MongoConnection);

    var _configType = t.ref('Map', t.string(), t.union(t.string(), t.number()));

    t.param('config', _configType).assert(config);

    var _this = _possibleConstructorReturn(this, (MongoConnection.__proto__ || Object.getPrototypeOf(MongoConnection)).call(this));

    _initDefineProp(_this, '_connection', _descriptor, _this);

    _initDefineProp(_this, '_connecting', _descriptor2, _this);

    _initDefineProp(_this, 'connectionFailed', _descriptor3, _this);

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
      t.return(t.ref(Db));

      throw new Error('call connect()');
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
}(AbstractConnection), (_descriptor = _applyDecoratedDescriptor(_class.prototype, '_connection', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, '_connecting', [_dec2], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'connectionFailed', [_dec3], {
  enumerable: true,
  initializer: null
})), _class));
export { MongoConnection as default };
//# sourceMappingURL=MongoConnection.js.map