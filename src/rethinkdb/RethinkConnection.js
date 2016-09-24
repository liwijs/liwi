import Logger from 'nightingale-logger';
import rethinkDB from 'rethinkdbdash';
import AbstractConnection from '../store/AbstractConnection';

const logger = new Logger('liwi.mongo.RethinkConnection');

export default class RethinkConnection extends AbstractConnection {
  _connection: Object|null;
  _connecting: boolean|null;
  connectionFailed: boolean;

  constructor(config: Map) {
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
      db: config.get('database'),
    });
  }

  connect(options: Object) {
    logger.info('connecting', options);

    this._connection = rethinkDB({
      ...options,
      buffer: 20,
      max: 100,
    });

    this._connection.getPoolMaster().on('healthy', (healthy) => {
      if (healthy === true) {
        logger.info('healthy');
      } else {
        logger.warn('not healthy');
      }
    });

    this.getConnection = () => Promise.resolve(this._connection);
  }

  getConnection(): Promise {
    throw new Error('call connect()');
  }

  close() {
    this.getConnection = () => Promise.reject(new Error('Connection closed'));
    if (this._connection) {
      return this._connection.getPoolMaster().drain().then(() => {
        this._connection = null;
      });
    } else if (this._connecting) {
      return this.getConnection().then(() => this.close());
    }
  }
}
