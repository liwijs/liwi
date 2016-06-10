'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = /**
                    * @function
                   */ function () { /**
                                     * @function
                                     * @param target
                                     * @param props
                                    */ function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return (/**
                                                                                                                                                                                                                                                                                                                                                                            * @function
                                                                                                                                                                                                                                                                                                                                                                            * @param Constructor
                                                                                                                                                                                                                                                                                                                                                                            * @param protoProps
                                                                                                                                                                                                                                                                                                                                                                            * @param staticProps
                                                                                                                                                                                                                                                                                                                                                                           */ function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; } ); }();

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _AbstractConnection2 = require('../store/AbstractConnection');

var _AbstractConnection3 = _interopRequireDefault(_AbstractConnection2);

var _mongodb = require('mongodb');

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function
 * @param instance
 * @param Constructor
*/
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @function
 * @param self
 * @param call
*/
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

/**
 * @function
 * @param subClass
 * @param superClass
*/
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var logger = new _nightingaleLogger2.default('liwi.mongo.MongoConnection');

var MongoConnection = /**
                       * @function
                       * @param _AbstractConnection
                      */function (_AbstractConnection) {
    _inherits(MongoConnection, _AbstractConnection);

    /**
     * @function
     * @param {Map} config
    */
    function MongoConnection(config) {
        _classCallCheck(this, MongoConnection);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MongoConnection).call(this));

        if (!config.has('host')) {
            config.set('host', 'localhost');
        }
        if (!config.has('port')) {
            config.set('port', '27017');
        }
        if (!config.has('database')) {
            throw new Error('Missing config database');
        }

        var connectionString = 'mongodb://' + (config.has('user') ? config.get('user') + ':' + config.get('password') + '@' : '') + (config.get('host') + ':' + config.get('port') + '/' + config.get('database'));

        _this.connect(connectionString);
        return _this;
    }

    _createClass(MongoConnection, [{
        key: 'connect',
        value: /**
                * @function
                * @param connectionString
               */function connect(connectionString) {
            var _this2 = this;

            logger.info('connecting', { connectionString: connectionString });

            var connectPromise = _mongodb.MongoClient.connect(connectionString).then(function (connection) {
                logger.info('connected', { connectionString: connectionString });
                connection.on('close', function () {
                    logger.warn('close', { connectionString: connectionString });
                    _this2.connectionFailed = true;
                    _this2.getConnection = function () {
                        return Promise.reject(new Error('MongoDB connection closed'));
                    };
                });
                connection.on('timeout', function () {
                    logger.warn('timeout', { connectionString: connectionString });
                    _this2.connectionFailed = true;
                    _this2.getConnection = function () {
                        return Promise.reject(new Error('MongoDB connection timeout'));
                    };
                });
                connection.on('reconnect', function () {
                    logger.warn('reconnect', { connectionString: connectionString });
                    _this2.connectionFailed = false;
                    _this2.getConnection = function () {
                        return Promise.resolve(_this2._connection);
                    };
                });
                connection.on('error', function (err) {
                    logger.warn('error', { connectionString: connectionString, err: err });
                });

                _this2._connection = connection;
                _this2._connecting = null;
                _this2.getConnection = function () {
                    return Promise.resolve(_this2._connection);
                };
                return connection;
            }).catch(function (err) {
                // throw err;
                process.nextTick(function () {
                    console.error(err.message || err);
                    process.exit(1);
                });
            });

            this.getConnection = function () {
                return Promise.resolve(connectPromise);
            };
            this._connecting = this.getConnection();
        }
    }, {
        key: 'getConnection',
        value: /**
                * @function
               */function getConnection() {
            throw new Error('call connect()');
        }
    }, {
        key: 'close',
        value: /**
                * @function
               */function close() {
            var _this3 = this;

            this.getConnection = function () {
                return Promise.reject(new Error('Connection closed'));
            };
            if (this._connection) {
                return this._connection.close();
            } else if (this._connecting) {
                return this._connecting.then(function () {
                    return _this3.close();
                });
            }
        }
    }]);

    return MongoConnection;
}(_AbstractConnection3.default);

exports.default = MongoConnection;
//# sourceMappingURL=MongoConnection.js.map