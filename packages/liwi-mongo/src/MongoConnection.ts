import { AbstractConnection } from 'liwi-store';
import mongodb from 'mongodb';
import Logger from 'nightingale-logger';

const logger = new Logger('liwi:mongo:MongoConnection');

export default class MongoConnection extends AbstractConnection {
  _connection?: mongodb.MongoClient;

  _connecting?: Promise<mongodb.MongoClient>;

  connectionFailed?: boolean;

  // TODO interface
  constructor(config: Map<string, string | number>) {
    super();

    if (!config.has('host')) {
      config.set('host', 'localhost');
    }
    if (!config.has('port')) {
      config.set('port', '27017');
    }
    if (!config.has('database')) {
      throw new Error('Missing config database');
    }

    const connectionString =
      `mongodb://${
        config.has('user')
          ? `${config.get('user') as string}:${
              config.get('password') as string
            }@`
          : ''
      }` +
      `${config.get('host') as string}:${config.get('port') as string}/${
        config.get('database') as string
      }`;

    this.connect(connectionString);
  }

  connect(connectionString: string): void {
    logger.info('connecting', { connectionString });

    const connectPromise = mongodb.MongoClient.connect(connectionString, {
      useNewUrlParser: true,
    })
      .then((connection) => {
        logger.info('connected', { connectionString });
        connection.on('close', () => {
          logger.warn('close', { connectionString });
          this.connectionFailed = true;
          this.getConnection = () => {
            throw new Error('MongoDB connection closed');
          };
        });
        connection.on('timeout', () => {
          logger.warn('timeout', { connectionString });
          this.connectionFailed = true;
          this.getConnection = () => {
            throw new Error('MongoDB connection timeout');
          };
        });
        connection.on('reconnect', () => {
          logger.warn('reconnect', { connectionString });
          this.connectionFailed = false;
          this.getConnection = () => Promise.resolve(this._connection!);
        });
        connection.on('error', (err) => {
          logger.warn('error', { connectionString, err });
        });

        this._connection = connection;
        this._connecting = undefined;
        this.getConnection = () => Promise.resolve(this._connection!);
        return connection;
      })
      .catch((err) => {
        logger.info('not connected', { connectionString });
        console.error(err.message || err);
        // throw err;
        process.nextTick(() => {
          // eslint-disable-next-line unicorn/no-process-exit
          process.exit(1);
        });

        throw err;
      });

    this.getConnection = () => Promise.resolve(connectPromise);
    this._connecting = this.getConnection();
  }

  getConnection(): Promise<mongodb.MongoClient> {
    throw new Error('call connect()');
  }

  async close(): Promise<void> {
    this.getConnection = () => Promise.reject(new Error('Connection closed'));
    if (this._connection) {
      await this._connection.close();
      this._connection = undefined;
    } else if (this._connecting) {
      await this._connecting;
      await this.close();
    }
  }
}
