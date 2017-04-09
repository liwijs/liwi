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
import rethinkDB from 'rethinkdbdash';
import AbstractConnection from '../store/AbstractConnection';

import t from 'flow-runtime';
var logger = new Logger('liwi:rethinkdb:RethinkConnection');

var RethinkConnection = (_dec = t.decorate(t.any()), _dec2 = t.decorate(t.union(t.boolean(), t.null())), _dec3 = t.decorate(t.boolean()), (_class = function (_AbstractConnection) {
  _inherits(RethinkConnection, _AbstractConnection);

  function RethinkConnection(config) {
    _classCallCheck(this, RethinkConnection);

    var _configType = t.ref('Map', t.string(), t.union(t.string(), t.number()));

    t.param('config', _configType).assert(config);

    var _this = _possibleConstructorReturn(this, (RethinkConnection.__proto__ || Object.getPrototypeOf(RethinkConnection)).call(this));

    _initDefineProp(_this, '_connection', _descriptor, _this);

    _initDefineProp(_this, '_connecting', _descriptor2, _this);

    _initDefineProp(_this, 'connectionFailed', _descriptor3, _this);

    if (!config.has('host')) {
      config.set('host', 'localhost');
    }
    if (!config.has('port')) {
      config.set('port', '28015');
    }
    if (!config.has('database')) {
      throw new Error('Missing config database');
    }

    _this.connect({
      host: config.get('host'),
      port: config.get('port'),
      db: config.get('database')
    });
    return _this;
  }

  _createClass(RethinkConnection, [{
    key: 'connect',
    value: function connect(options) {
      var _this2 = this;

      var _optionsType = t.object();

      t.param('options', _optionsType).assert(options);

      logger.info('connecting', options);

      this._connection = rethinkDB(Object.assign({}, options, {
        buffer: 20,
        max: 100
      }));

      this._connection.getPoolMaster().on('healthy', function (healthy) {
        if (healthy === true) {
          _this2.getConnection = function () {
            return Promise.resolve(_this2._connection);
          };
          logger.info('healthy');
        } else {
          _this2.getConnection = function () {
            return Promise.reject(new Error('Connection not healthy'));
          };
          logger.warn('not healthy');
        }
      });

      this.getConnection = function () {
        return Promise.resolve(_this2._connection);
      };
    }
  }, {
    key: 'getConnection',
    value: function getConnection() {
      t.return(t.void());

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
        return this._connection.getPoolMaster().drain().then(function () {
          logger.info('connection closed');
          _this3._connection = null;
        });
      } else if (this._connecting) {
        return this.getConnection().then(function () {
          return _this3.close();
        });
      }
    }
  }]);

  return RethinkConnection;
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
export { RethinkConnection as default };
//# sourceMappingURL=RethinkConnection.js.map