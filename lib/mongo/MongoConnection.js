'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _AbstractConnection = require('../store/AbstractConnection');

var _AbstractConnection2 = _interopRequireDefault(_AbstractConnection);

var _mongodb = require('mongodb');

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let MongoConnection = class MongoConnection extends _AbstractConnection2.default {
    /**
     * @param {Map} config
    */

    constructor(config) {
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

        const connectPromise = _mongodb.MongoClient.connect(connectionString).then(connection => {
            this._connection = connection;
            this._connecting = null;
            this.getConnection = () => {
                return Promise.resolve(this._connection);
            };
            return connection;
        }).catch(err => {
            this.getConnection = () => Promise.reject(err);
            throw err;
        });

        this.getConnection = () => Promise.resolve(connectPromise);
        this._connecting = this.getConnection();
    }

    /**
     * @returns {Promise.<Db>}
    */getConnection() {
        throw new Error('call connect()');
    }

    close() {
        if (this._connection) {
            return this._connection.close();
        } else if (this._connecting) {
            return this._connecting.then(() => this.close());
        }
    }
};
exports.default = MongoConnection;
//# sourceMappingURL=MongoConnection.js.map