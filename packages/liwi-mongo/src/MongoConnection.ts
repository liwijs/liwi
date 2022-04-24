import { AbstractConnection } from 'liwi-store';
import mongodb from 'mongodb';
import { Logger } from 'nightingale-logger';

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

    const buildConnectionString = (redactCredentials: boolean): string =>
      `mongodb://${
        config.has('user')
          ? `${
              redactCredentials
                ? `${(config.get('user') as string).slice(0, 2)}[redacted]`
                : (config.get('user') as string)
            }:${
              redactCredentials
                ? '[redacted]'
                : (config.get('password') as string)
            }@`
          : ''
      }` +
      `${config.get('host') as string}:${config.get('port') as string}/${
        config.get('database') as string
      }`;

    const connectionString = buildConnectionString(false);
    const connectionStringRedacted = buildConnectionString(true);

    this.connect(connectionString, connectionStringRedacted);
  }

  connect(connectionString: string, connectionStringRedacted: string): void {
    logger.info('connecting', { connectionStringRedacted });

    const connectPromise = mongodb.MongoClient.connect(connectionString)
      .then((connection) => {
        logger.info('connected', { connectionStringRedacted });
        connection.on('close', () => {
          logger.warn('close', { connectionStringRedacted });
          this.connectionFailed = true;
          this.getConnection = () => {
            throw new Error('MongoDB connection closed');
          };
        });
        connection.on('timeout', () => {
          logger.warn('timeout', { connectionStringRedacted });
          this.connectionFailed = true;
          this.getConnection = () => {
            throw new Error('MongoDB connection timeout');
          };
        });
        connection.on('reconnect', () => {
          logger.warn('reconnect', { connectionStringRedacted });
          this.connectionFailed = false;
          this.getConnection = () => Promise.resolve(this._connection!);
        });
        connection.on('error', (err) => {
          logger.warn('error', { connectionStringRedacted, err });
        });

        this._connection = connection;
        this._connecting = undefined;
        this.getConnection = () => Promise.resolve(this._connection!);
        return connection;
      })
      .catch((err) => {
        logger.info('not connected', { connectionStringRedacted });
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
