import Logger from 'nightingale-logger';
import { MongoClient } from 'mongodb';
import Db from 'mongodb/lib/db';
import AbstractConnection from '../store/AbstractConnection';

import t from 'flow-runtime';
const logger = new Logger('liwi:mongo:MongoConnection');

let MongoConnection = class extends AbstractConnection {

  constructor(config) {
    let _configType = t.ref('Map', t.string(), t.union(t.string(), t.number()));

    if (t.param('config', _configType).assert(config), super(), config.has('host') || config.set('host', 'localhost'), config.has('port') || config.set('port', '27017'), !config.has('database')) throw new Error('Missing config database');

    const connectionString = `mongodb://${config.has('user') ? `${config.get('user')}:${config.get('password')}@` : ''}` + `${config.get('host')}:${config.get('port')}/${config.get('database')}`;

    this.connect(connectionString);
  }

  connect(connectionString) {
    logger.info('connecting', { connectionString });


    const connectPromise = MongoClient.connect(connectionString).then(connection => (logger.info('connected', { connectionString }), connection.on('close', () => {
      logger.warn('close', { connectionString }), this.connectionFailed = true, this.getConnection = () => Promise.reject(new Error('MongoDB connection closed'));
    }), connection.on('timeout', () => {
      logger.warn('timeout', { connectionString }), this.connectionFailed = true, this.getConnection = () => Promise.reject(new Error('MongoDB connection timeout'));
    }), connection.on('reconnect', () => {
      logger.warn('reconnect', { connectionString }), this.connectionFailed = false, this.getConnection = () => Promise.resolve(this._connection);
    }), connection.on('error', err => {
      logger.warn('error', { connectionString, err });
    }), this._connection = connection, this._connecting = null, this.getConnection = () => Promise.resolve(this._connection), connection)).catch(err => {

      throw logger.info('not connected', { connectionString }), console.error(err.message || err), process.nextTick(() => {
        process.exit(1);
      }), err;
    });

    this.getConnection = () => Promise.resolve(connectPromise), this._connecting = this.getConnection();
  }

  getConnection() {
    t.return(t.ref(Db));

    throw new Error('call connect()');
  }

  close() {
    return (this.getConnection = () => Promise.reject(new Error('Connection closed')), this._connection) ? this._connection.close().then(() => {
      this._connection = null;
    }) : this._connecting ? this._connecting.then(() => this.close()) : void 0;
  }
};
export { MongoConnection as default };
//# sourceMappingURL=MongoConnection.js.map