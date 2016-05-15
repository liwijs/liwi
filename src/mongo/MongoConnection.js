import AbstractConnection from '../store/AbstractConnection';
import { MongoClient } from 'mongodb';
import type Db from 'mongodb/lib/db';

export default class MongoConnection extends AbstractConnection {
    _connection: Db|null;
    _connecting: Promise|null;

    constructor(config: Map) {
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

        const connectionString = `mongodb://${config.has('user') ? `${config.get('user')}:${config.get('password')}@` : ''}`
                               + `${config.get('host')}:${config.get('port')}/${config.get('database')}`;


        const connectPromise = MongoClient.connect(connectionString)
            .then(connection => {
                this._connection = connection;
                this._connecting = null;
                this.getConnection = () => {
                    return Promise.resolve(this._connection);
                };
                return connection;
            })
            .catch(err => {
                this.getConnection = () => Promise.reject(err);
                throw err;
            });

        this.getConnection = () => Promise.resolve(connectPromise);
        this._connecting = this.getConnection();
    }

    getConnection(): Promise<Db> {
        throw new Error('call connect()');
    }

    close() {
        if (this._connection) {
            return this._connection.close();
        } else if (this._connecting) {
            return this._connecting.then(() => this.close());
        }
    }
}
