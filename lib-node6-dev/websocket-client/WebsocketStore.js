'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _class, _temp;

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _AbstractStore = require('../store/AbstractStore');

var _AbstractStore2 = _interopRequireDefault(_AbstractStore);

var _WebsocketCursor = require('./WebsocketCursor');

var _WebsocketCursor2 = _interopRequireDefault(_WebsocketCursor);

var _extendedJson = require('../extended-json');

var _Query = require('./Query');

var _Query2 = _interopRequireDefault(_Query);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('liwi:websocket-client');

const WebsocketConnectionType = _flowRuntime2.default.type('WebsocketConnectionType', _flowRuntime2.default.object(_flowRuntime2.default.property('emit', _flowRuntime2.default.function()), _flowRuntime2.default.property('isConnected', _flowRuntime2.default.function())));

const _WebsocketStoreTypeParametersSymbol = Symbol('WebsocketStoreTypeParameters');

let WebsocketStore = (_temp = _class = class extends _AbstractStore2.default {

  constructor(websocket, restName) {
    const _typeParameters = {
      ModelType: _flowRuntime2.default.typeParameter('ModelType')
    };

    let _restNameType = _flowRuntime2.default.string();

    _flowRuntime2.default.param('websocket', WebsocketConnectionType).assert(websocket);

    _flowRuntime2.default.param('restName', _restNameType).assert(restName);

    super(websocket);

    this.keyPath = 'id';
    this[_WebsocketStoreTypeParametersSymbol] = _typeParameters;

    _flowRuntime2.default.bindTypeParameters(this, WebsocketConnectionType);

    if (!restName) {
      throw new Error(`Invalid restName: "${restName}"`);
    }

    this.restName = restName;
  }

  createQuery(key) {
    let _keyType = _flowRuntime2.default.string();

    _flowRuntime2.default.param('key', _keyType).assert(key);

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
    const registerOnConnect = () => {
      this.connection.on('connect', emit);
      return () => this.connection.off('connect', emit);
    };

    if (this.connection.isConnected()) {
      return emit().then(registerOnConnect);
    }

    return Promise.resolve(registerOnConnect());
  }

  insertOne(object) {
    let _objectType = _flowRuntime2.default.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    const _returnType = _flowRuntime2.default.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    _flowRuntime2.default.param('object', _objectType).assert(object);

    return this.emit('insertOne', object).then(_arg => _returnType.assert(_arg));
  }

  updateOne(object) {
    let _objectType2 = _flowRuntime2.default.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    const _returnType2 = _flowRuntime2.default.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    _flowRuntime2.default.param('object', _objectType2).assert(object);

    return this.emit('updateOne', object).then(_arg2 => _returnType2.assert(_arg2));
  }

  updateSeveral(objects) {
    let _objectsType = _flowRuntime2.default.array(_flowRuntime2.default.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType));

    const _returnType3 = _flowRuntime2.default.return(_flowRuntime2.default.array(this[_WebsocketStoreTypeParametersSymbol].ModelType));

    _flowRuntime2.default.param('objects', _objectsType).assert(objects);

    return this.emit('updateSeveral', objects).then(_arg3 => _returnType3.assert(_arg3));
  }

  partialUpdateByKey(key, partialUpdate) {
    let _keyType2 = _flowRuntime2.default.any();

    let _partialUpdateType = _flowRuntime2.default.object();

    const _returnType4 = _flowRuntime2.default.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    _flowRuntime2.default.param('key', _keyType2).assert(key);

    _flowRuntime2.default.param('partialUpdate', _partialUpdateType).assert(partialUpdate);

    return this.emit('partialUpdateByKey', key, partialUpdate).then(_arg4 => _returnType4.assert(_arg4));
  }

  partialUpdateOne(object, partialUpdate) {
    let _objectType3 = _flowRuntime2.default.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    let _partialUpdateType2 = _flowRuntime2.default.object();

    const _returnType5 = _flowRuntime2.default.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    _flowRuntime2.default.param('object', _objectType3).assert(object);

    _flowRuntime2.default.param('partialUpdate', _partialUpdateType2).assert(partialUpdate);

    return this.emit('partialUpdateOne', object, partialUpdate).then(_arg5 => _returnType5.assert(_arg5));
  }

  partialUpdateMany(criteria, partialUpdate) {
    let _partialUpdateType3 = _flowRuntime2.default.object();

    const _returnType6 = _flowRuntime2.default.return(_flowRuntime2.default.void());

    _flowRuntime2.default.param('partialUpdate', _partialUpdateType3).assert(partialUpdate);

    return this.emit('partialUpdateMany', criteria, partialUpdate).then(_arg6 => _returnType6.assert(_arg6));
  }

  deleteByKey(key) {
    let _keyType3 = _flowRuntime2.default.any();

    const _returnType7 = _flowRuntime2.default.return(_flowRuntime2.default.void());

    _flowRuntime2.default.param('key', _keyType3).assert(key);

    return this.emit('deleteByKey', key).then(_arg7 => _returnType7.assert(_arg7));
  }

  deleteOne(object) {
    let _objectType4 = _flowRuntime2.default.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    const _returnType8 = _flowRuntime2.default.return(_flowRuntime2.default.void());

    _flowRuntime2.default.param('object', _objectType4).assert(object);

    return this.emit('deleteOne', object).then(_arg8 => _returnType8.assert(_arg8));
  }

  cursor(criteria, sort) {
    let _criteriaType = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

    let _sortType = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

    const _returnType9 = _flowRuntime2.default.return(_flowRuntime2.default.ref(_WebsocketCursor2.default, this[_WebsocketStoreTypeParametersSymbol].ModelType));

    _flowRuntime2.default.param('criteria', _criteriaType).assert(criteria);

    _flowRuntime2.default.param('sort', _sortType).assert(sort);

    return Promise.resolve(new _WebsocketCursor2.default(this, { criteria, sort })).then(_arg9 => _returnType9.assert(_arg9));
  }

  findByKey(key) {
    let _keyType4 = _flowRuntime2.default.any();

    _flowRuntime2.default.param('key', _keyType4).assert(key);

    return this.findOne({ id: key });
  }

  findOne(criteria, sort) {
    let _criteriaType2 = _flowRuntime2.default.object();

    let _sortType2 = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

    const _returnType10 = _flowRuntime2.default.return(_flowRuntime2.default.object());

    _flowRuntime2.default.param('criteria', _criteriaType2).assert(criteria);

    _flowRuntime2.default.param('sort', _sortType2).assert(sort);

    return this.emit('findOne', criteria, sort).then(_arg10 => _returnType10.assert(_arg10));
  }
}, _class[_flowRuntime2.default.TypeParametersSymbol] = _WebsocketStoreTypeParametersSymbol, _temp);
exports.default = WebsocketStore;
//# sourceMappingURL=WebsocketStore.js.map