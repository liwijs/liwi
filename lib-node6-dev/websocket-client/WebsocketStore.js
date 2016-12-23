'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _AbstractStore = require('../store/AbstractStore');

var _AbstractStore2 = _interopRequireDefault(_AbstractStore);

var _WebsocketCursor = require('./WebsocketCursor');

var _WebsocketCursor2 = _interopRequireDefault(_WebsocketCursor);

var _extendedJson = require('../extended-json');

var _Query = require('./Query');

var _Query2 = _interopRequireDefault(_Query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('liwi:websocket-client');

const WebsocketConnection = _tcombForked2.default.interface({
  emit: _tcombForked2.default.Function,
  isConnected: _tcombForked2.default.Function
}, 'WebsocketConnection');

class WebsocketStore extends _AbstractStore2.default {

  constructor(websocket, restName) {
    _assert(websocket, WebsocketConnection, 'websocket');

    _assert(restName, _tcombForked2.default.String, 'restName');

    super(websocket);

    this.keyPath = 'id';
    if (!restName) {
      throw new Error(`Invalid restName: "${ restName }"`);
    }

    this.restName = restName;
  }

  createQuery(key) {
    _assert(key, _tcombForked2.default.String, 'key');

    logger.debug('createQuery', { key });
    return new _Query2.default(this, key);
  }

  emit(type, ...args) {
    logger.debug('emit', { type, args });
    if (this.connection.isDisconnected()) {
      throw new Error('Websocket is not connected');
    }

    return this.connection.emit('rest', {
      type,
      restName: this.restName,
      json: (0, _extendedJson.encode)(args)
    }).then(result => result && (0, _extendedJson.decode)(result));
  }

  emitSubscribe(type, ...args) {
    const emit = () => this.emit(type, ...args);
    return emit().then(() => {
      this.connection.on('reconnect', emit);
      return () => this.connection.off('reconnect', emit);
    });
  }

  insertOne(object) {
    _assert(object, _tcombForked2.default.Any, 'object');

    return _assert(function () {
      return this.emit('insertOne', object);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  updateOne(object) {
    _assert(object, _tcombForked2.default.Any, 'object');

    return _assert(function () {
      return this.emit('updateOne', object);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  updateSeveral(objects) {
    _assert(objects, _tcombForked2.default.list(_tcombForked2.default.Any), 'objects');

    return _assert(function () {
      return this.emit('updateSeveral', objects);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  partialUpdateByKey(key, partialUpdate) {
    _assert(key, _tcombForked2.default.Any, 'key');

    _assert(partialUpdate, _tcombForked2.default.Object, 'partialUpdate');

    return _assert(function () {
      return this.emit('partialUpdateByKey', key, partialUpdate);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  partialUpdateOne(object, partialUpdate) {
    _assert(object, _tcombForked2.default.Any, 'object');

    _assert(partialUpdate, _tcombForked2.default.Object, 'partialUpdate');

    return _assert(function () {
      return this.emit('partialUpdateOne', object, partialUpdate);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  partialUpdateMany(criteria, partialUpdate) {
    _assert(partialUpdate, _tcombForked2.default.Object, 'partialUpdate');

    return _assert(function () {
      return this.emit('partialUpdateMany', criteria, partialUpdate);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  deleteByKey(key) {
    _assert(key, _tcombForked2.default.Any, 'key');

    return _assert(function () {
      return this.emit('deleteByKey', key);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  deleteOne(object) {
    _assert(object, _tcombForked2.default.Any, 'object');

    return _assert(function () {
      return this.emit('deleteOne', object);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  cursor(criteria, sort) {
    _assert(criteria, _tcombForked2.default.maybe(_tcombForked2.default.Object), 'criteria');

    _assert(sort, _tcombForked2.default.maybe(_tcombForked2.default.Object), 'sort');

    return _assert(function () {
      return Promise.resolve(new _WebsocketCursor2.default(this, { criteria, sort }));
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  findByKey(key) {
    _assert(key, _tcombForked2.default.Any, 'key');

    return this.findOne({ id: key });
  }

  findOne(criteria, sort) {
    _assert(criteria, _tcombForked2.default.Object, 'criteria');

    _assert(sort, _tcombForked2.default.maybe(_tcombForked2.default.Object), 'sort');

    return _assert(function () {
      return this.emit('findOne', criteria, sort);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }
}
exports.default = WebsocketStore;

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=WebsocketStore.js.map