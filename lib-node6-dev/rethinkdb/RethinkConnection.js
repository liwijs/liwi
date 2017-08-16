'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]); } return target; };

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _rethinkdbdash = require('rethinkdbdash');

var _rethinkdbdash2 = _interopRequireDefault(_rethinkdbdash);

var _AbstractConnection = require('../store/AbstractConnection');

var _AbstractConnection2 = _interopRequireDefault(_AbstractConnection);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('liwi:rethinkdb:RethinkConnection');

let RethinkConnection = class extends _AbstractConnection2.default {

  constructor(config) {
    let _configType = _flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.union(_flowRuntime2.default.string(), _flowRuntime2.default.number()));

    if (_flowRuntime2.default.param('config', _configType).assert(config), super(), config.has('host') || config.set('host', 'localhost'), config.has('port') || config.set('port', '28015'), !config.has('database')) throw new Error('Missing config database');

    this.connect({
      host: config.get('host'),
      port: config.get('port'),
      db: config.get('database')
    });
  }

  connect(options) {
    let _optionsType = _flowRuntime2.default.object();

    _flowRuntime2.default.param('options', _optionsType).assert(options), logger.info('connecting', options), this._connection = (0, _rethinkdbdash2.default)(_extends({}, options, {
      buffer: 20,
      max: 100
    })), this._connection.getPoolMaster().on('healthy', healthy => {
      healthy === true ? (this.getConnection = () => Promise.resolve(this._connection), logger.info('healthy')) : (this.getConnection = () => Promise.reject(new Error('Connection not healthy')), logger.warn('not healthy'));
    }), this.getConnection = () => Promise.resolve(this._connection);
  }

  getConnection() {
    _flowRuntime2.default.return(_flowRuntime2.default.void());

    throw new Error('call connect()');
  }

  close() {
    return (this.getConnection = () => Promise.reject(new Error('Connection closed')), this._connection) ? this._connection.getPoolMaster().drain().then(() => {
      logger.info('connection closed'), this._connection = null;
    }) : this._connecting ? this.getConnection().then(() => this.close()) : void 0;
  }
};
exports.default = RethinkConnection;
//# sourceMappingURL=RethinkConnection.js.map