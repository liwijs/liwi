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
import rethinkDB from 'rethinkdbdash';
import AbstractConnection from '../store/AbstractConnection';

import t from 'flow-runtime';
const logger = new Logger('liwi:rethinkdb:RethinkConnection');

let RethinkConnection = (_dec = t.decorate(t.any()), _dec2 = t.decorate(t.union(t.boolean(), t.null())), _dec3 = t.decorate(t.boolean()), (_class = class extends AbstractConnection {

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
    var _this = this;

    let _optionsType = t.object();

    t.param('options', _optionsType).assert(options);

    logger.info('connecting', options);

    this._connection = rethinkDB(Object.assign({}, options, {
      buffer: 20,
      max: 100
    }));

    this._connection.getPoolMaster().on('healthy', function (healthy) {
      if (healthy === true) {
        _this.getConnection = function () {
          return Promise.resolve(_this._connection);
        };
        logger.info('healthy');
      } else {
        _this.getConnection = function () {
          return Promise.reject(new Error('Connection not healthy'));
        };
        logger.warn('not healthy');
      }
    });

    this.getConnection = function () {
      return Promise.resolve(_this._connection);
    };
  }

  getConnection() {
    t.return(t.void());

    throw new Error('call connect()');
  }

  close() {
    var _this2 = this;

    this.getConnection = function () {
      return Promise.reject(new Error('Connection closed'));
    };
    if (this._connection) {
      return this._connection.getPoolMaster().drain().then(function () {
        logger.info('connection closed');
        _this2._connection = null;
      });
    } else if (this._connecting) {
      return this.getConnection().then(function () {
        return _this2.close();
      });
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
export { RethinkConnection as default };
//# sourceMappingURL=RethinkConnection.js.map