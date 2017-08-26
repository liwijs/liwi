import Logger from 'nightingale-logger';
import rethinkDB from 'rethinkdbdash';
import AbstractConnection from '../store/AbstractConnection';

const logger = new Logger('liwi:rethinkdb:RethinkConnection');

let RethinkConnection = class extends AbstractConnection {

  constructor(config) {
    super();

    if (!config.has('host')) {
      config.set('host', 'localhost');
    }
    if (!config.has('port')) {
      config.set('port', '28015');
    }
    if (!config.has('database')) {
      throw new Error('Missing config database');
    }

    this.connect({
      host: config.get('host'),
      port: config.get('port'),
      db: config.get('database')
    });
  }

  connect(options) {
    var _this = this;

    logger.info('connecting', options);

    this._connection = rethinkDB(Object.assign({}, options, {
      buffer: 20,
      max: 100
    }));

    this._connection.getPoolMaster().on('healthy', function (healthy) {
      if (healthy === true) {
        _this.getConnection = function () {
          return Promise.resolve(_this._connection);
        };
        logger.info('healthy');
      } else {
        _this.getConnection = function () {
          return Promise.reject(new Error('Connection not healthy'));
        };
        logger.warn('not healthy');
      }
    });

    this.getConnection = function () {
      return Promise.resolve(_this._connection);
    };
  }

  getConnection() {
    throw new Error('call connect()');
  }

  close() {
    var _this2 = this;

    this.getConnection = function () {
      return Promise.reject(new Error('Connection closed'));
    };
    if (this._connection) {
      return this._connection.getPoolMaster().drain().then(function () {
        logger.info('connection closed');
        _this2._connection = null;
      });
    } else if (this._connecting) {
      return this.getConnection().then(function () {
        return _this2.close();
      });
    }
  }
};
export { RethinkConnection as default };
//# sourceMappingURL=RethinkConnection.js.map