var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Logger from 'nightingale-logger';
import rethinkDB from 'rethinkdbdash';
import AbstractConnection from '../store/AbstractConnection';

var logger = new Logger('liwi.mongo.RethinkConnection');

var RethinkConnection = function (_AbstractConnection) {
  _inherits(RethinkConnection, _AbstractConnection);

  function RethinkConnection(config) {
    _classCallCheck(this, RethinkConnection);

    var _this = _possibleConstructorReturn(this, (RethinkConnection.__proto__ || Object.getPrototypeOf(RethinkConnection)).call(this));

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

      logger.info('connecting', options);

      this._connection = rethinkDB(_extends({}, options, {
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
}(AbstractConnection);

export default RethinkConnection;
//# sourceMappingURL=RethinkConnection.js.map