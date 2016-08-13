'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _mongodb = require('mongodb');

var _db = require('mongodb/lib/db');

var _db2 = _interopRequireDefault(_db);

var _AbstractConnection = require('../store/AbstractConnection');

var _AbstractConnection2 = _interopRequireDefault(_AbstractConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('liwi.mongo.MongoConnection');

class MongoConnection extends _AbstractConnection2.default {

    constructor(config) {
        if (!(config instanceof Map)) {
            throw new TypeError('Value of argument "config" violates contract.\n\nExpected:\nMap\n\nGot:\n' + _inspect(config));
        }

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

        const connectionString = `mongodb://${ config.has('user') ? `${ config.get('user') }:${ config.get('password') }@` : '' }` + `${ config.get('host') }:${ config.get('port') }/${ config.get('database') }`;

        this.connect(connectionString);
    }

    connect(connectionString) {
        logger.info('connecting', { connectionString });

        const connectPromise = _mongodb.MongoClient.connect(connectionString).then(connection => {
            logger.info('connected', { connectionString });
            connection.on('close', () => {
                logger.warn('close', { connectionString });
                this.connectionFailed = true;
                this.getConnection = () => {
                    return Promise.reject(new Error('MongoDB connection closed'));
                };

                if (!(typeof this.getConnection === 'function')) {
                    throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(this.getConnection));
                }
            });
            connection.on('timeout', () => {
                logger.warn('timeout', { connectionString });
                this.connectionFailed = true;
                this.getConnection = () => {
                    return Promise.reject(new Error('MongoDB connection timeout'));
                };

                if (!(typeof this.getConnection === 'function')) {
                    throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(this.getConnection));
                }
            });
            connection.on('reconnect', () => {
                logger.warn('reconnect', { connectionString });
                this.connectionFailed = false;
                this.getConnection = () => {
                    return Promise.resolve(this._connection);
                };

                if (!(typeof this.getConnection === 'function')) {
                    throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(this.getConnection));
                }
            });
            connection.on('error', err => {
                logger.warn('error', { connectionString, err });
            });

            this._connection = connection;

            if (!(this._connection instanceof _db2.default || this._connection == null)) {
                throw new TypeError('Value of "this._connection" violates contract.\n\nExpected:\nDb | null\n\nGot:\n' + _inspect(this._connection));
            }

            this._connecting = null;

            if (!(this._connecting instanceof Promise || this._connecting == null)) {
                throw new TypeError('Value of "this._connecting" violates contract.\n\nExpected:\nPromise | null\n\nGot:\n' + _inspect(this._connecting));
            }

            this.getConnection = () => {
                return Promise.resolve(this._connection);
            };

            if (!(typeof this.getConnection === 'function')) {
                throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(this.getConnection));
            }

            return connection;
        }).catch(err => {
            logger.info('not connected', { connectionString });
            console.error(err.message || err);
            // throw err;
            process.nextTick(() => {
                process.exit(1);
            });

            throw err;
        });

        this.getConnection = () => {
            return Promise.resolve(connectPromise);
        };

        if (!(typeof this.getConnection === 'function')) {
            throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(this.getConnection));
        }

        this._connecting = this.getConnection();

        if (!(this._connecting instanceof Promise || this._connecting == null)) {
            throw new TypeError('Value of "this._connecting" violates contract.\n\nExpected:\nPromise | null\n\nGot:\n' + _inspect(this._connecting));
        }
    }

    getConnection() {
        throw new Error('call connect()');
    }

    close() {
        this.getConnection = () => {
            return Promise.reject(new Error('Connection closed'));
        };

        if (!(typeof this.getConnection === 'function')) {
            throw new TypeError('Value of "this.getConnection" violates contract.\n\nExpected:\n() => Promise<Db>\n\nGot:\n' + _inspect(this.getConnection));
        }

        if (this._connection) {
            return this._connection.close();
        } else if (this._connecting) {
            return this._connecting.then(() => {
                return this.close();
            });
        }
    }
}
exports.default = MongoConnection;

function _inspect(input, depth) {
    const maxDepth = 4;
    const maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input;
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            if (depth > maxDepth) return '[...]';

            const first = _inspect(input[0], depth);

            if (input.every(item => _inspect(item, depth) === first)) {
                return first.trim() + '[]';
            } else {
                return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
            }
        } else {
            return 'Array';
        }
    } else {
        const keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        const indent = '  '.repeat(depth - 1);
        let entries = keys.slice(0, maxKeys).map(key => {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}
//# sourceMappingURL=MongoConnection.js.map