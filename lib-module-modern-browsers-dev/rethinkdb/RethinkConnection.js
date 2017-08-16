var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]); } return target; };

import Logger from 'nightingale-logger';
import rethinkDB from 'rethinkdbdash';
import AbstractConnection from '../store/AbstractConnection';

import t from 'flow-runtime';
const logger = new Logger('liwi:rethinkdb:RethinkConnection');

let RethinkConnection = class extends AbstractConnection {

  constructor(config) {
    let _configType = t.ref('Map', t.string(), t.union(t.string(), t.number()));

    if (t.param('config', _configType).assert(config), super(), config.has('host') || config.set('host', 'localhost'), config.has('port') || config.set('port', '28015'), !config.has('database')) throw new Error('Missing config database');

    this.connect({
      host: config.get('host'),
      port: config.get('port'),
      db: config.get('database')
    });
  }

  connect(options) {
    var _this = this;

    let _optionsType = t.object();

    t.param('options', _optionsType).assert(options), logger.info('connecting', options), this._connection = rethinkDB(_extends({}, options, {
      buffer: 20,
      max: 100
    })), this._connection.getPoolMaster().on('healthy', function (healthy) {
      healthy === true ? (_this.getConnection = function () {
        return Promise.resolve(_this._connection);
      }, logger.info('healthy')) : (_this.getConnection = function () {
        return Promise.reject(new Error('Connection not healthy'));
      }, logger.warn('not healthy'));
    }), this.getConnection = function () {
      return Promise.resolve(_this._connection);
    };
  }

  getConnection() {
    t.return(t.void());

    throw new Error('call connect()');
  }

  close() {
    var _this2 = this;

    return (this.getConnection = function () {
      return Promise.reject(new Error('Connection closed'));
    }, this._connection) ? this._connection.getPoolMaster().drain().then(function () {
      logger.info('connection closed'), _this2._connection = null;
    }) : this._connecting ? this.getConnection().then(function () {
      return _this2.close();
    }) : void 0;
  }
};
export { RethinkConnection as default };
//# sourceMappingURL=RethinkConnection.js.map