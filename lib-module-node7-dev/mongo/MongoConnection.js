var _dec, _dec2, _dec3, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['keys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['defineProperty'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper() {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import Logger from 'nightingale-logger';
import { MongoClient } from 'mongodb';
import Db from 'mongodb/lib/db';
import AbstractConnection from '../store/AbstractConnection';

import t from 'flow-runtime';
const logger = new Logger('liwi:mongo:MongoConnection');

let MongoConnection = (_dec = t.decorate(function () {
  return t.union(t.ref(Db), t.null());
}), _dec2 = t.decorate(t.union(t.ref('Promise', t.void()), t.null())), _dec3 = t.decorate(t.boolean()), (_class = class extends AbstractConnection {

  constructor(config) {
    let _configType = t.ref('Map', t.string(), t.union(t.string(), t.number()));

    t.param('config', _configType).assert(config);

    super();

    _initDefineProp(this, '_connection', _descriptor, this);

    _initDefineProp(this, '_connecting', _descriptor2, this);

    _initDefineProp(this, 'connectionFailed', _descriptor3, this);

    if (!config.has('host')) {
      config.set('host', 'localhost');
    }
    if (!config.has('port')) {
      config.set('port', '27017');
    }
    if (!config.has('database')) {
      throw new Error('Missing config database');
    }

    const connectionString = `mongodb://${config.has('user') ? `${config.get('user')}:${config.get('password')}@` : ''}` + `${config.get('host')}:${config.get('port')}/${config.get('database')}`;

    this.connect(connectionString);
  }

  connect(connectionString) {
    logger.info('connecting', { connectionString });

    const connectPromise = MongoClient.connect(connectionString).then(connection => {
      logger.info('connected', { connectionString });
      connection.on('close', () => {
        logger.warn('close', { connectionString });
        this.connectionFailed = true;
        this.getConnection = () => Promise.reject(new Error('MongoDB connection closed'));
      });
      connection.on('timeout', () => {
        logger.warn('timeout', { connectionString });
        this.connectionFailed = true;
        this.getConnection = () => Promise.reject(new Error('MongoDB connection timeout'));
      });
      connection.on('reconnect', () => {
        logger.warn('reconnect', { connectionString });
        this.connectionFailed = false;
        this.getConnection = () => Promise.resolve(this._connection);
      });
      connection.on('error', err => {
        logger.warn('error', { connectionString, err });
      });

      this._connection = connection;
      this._connecting = null;
      this.getConnection = () => Promise.resolve(this._connection);
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

    this.getConnection = () => Promise.resolve(connectPromise);
    this._connecting = this.getConnection();
  }

  getConnection() {
    t.return(t.ref(Db));

    throw new Error('call connect()');
  }

  close() {
    this.getConnection = () => Promise.reject(new Error('Connection closed'));
    if (this._connection) {
      return this._connection.close().then(() => {
        this._connection = null;
      });
    } else if (this._connecting) {
      return this._connecting.then(() => this.close());
    }
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, '_connection', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, '_connecting', [_dec2], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'connectionFailed', [_dec3], {
  enumerable: true,
  initializer: null
})), _class));
export { MongoConnection as default };
//# sourceMappingURL=MongoConnection.js.map