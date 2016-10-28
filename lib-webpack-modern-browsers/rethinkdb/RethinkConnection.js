var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Logger from 'nightingale-logger';
import rethinkDB from 'rethinkdbdash';
import AbstractConnection from '../store/AbstractConnection';

var logger = new Logger('liwi:mongo:RethinkConnection');

export default class RethinkConnection extends AbstractConnection {

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
    logger.info('connecting', options);

    this._connection = rethinkDB(_extends({}, options, {
      buffer: 20,
      max: 100
    }));

    this._connection.getPoolMaster().on('healthy', healthy => {
      if (healthy === true) {
        this.getConnection = () => Promise.resolve(this._connection);
        logger.info('healthy');
      } else {
        this.getConnection = () => Promise.reject(new Error('Connection not healthy'));
        logger.warn('not healthy');
      }
    });

    this.getConnection = () => Promise.resolve(this._connection);
  }

  getConnection() {
    throw new Error('call connect()');
  }

  close() {
    this.getConnection = () => Promise.reject(new Error('Connection closed'));
    if (this._connection) {
      return this._connection.getPoolMaster().drain().then(() => {
        logger.info('connection closed');
        this._connection = null;
      });
    } else if (this._connecting) {
      return this.getConnection().then(() => this.close());
    }
  }
}
//# sourceMappingURL=RethinkConnection.js.map