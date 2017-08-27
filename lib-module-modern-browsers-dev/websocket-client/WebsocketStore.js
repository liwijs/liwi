var _class, _temp;

import Logger from 'nightingale-logger';
import AbstractStore from '../store/AbstractStore';
import WebsocketCursor from './WebsocketCursor';
import { encode, decode } from '../extended-json';
import Query from './Query';

import t from 'flow-runtime';
const logger = new Logger('liwi:websocket-client');

const WebsocketConnectionType = t.type('WebsocketConnectionType', t.object(t.property('emit', t.function()), t.property('isConnected', t.function())));

const _WebsocketStoreTypeParametersSymbol = Symbol('WebsocketStoreTypeParameters');

let WebsocketStore = (_temp = _class = class extends AbstractStore {

  constructor(websocket, restName) {
    const _typeParameters = {
      ModelType: t.typeParameter('ModelType')
    };

    let _restNameType = t.string();

    t.param('websocket', WebsocketConnectionType).assert(websocket);
    t.param('restName', _restNameType).assert(restName);

    super(websocket);

    this.keyPath = 'id';
    this[_WebsocketStoreTypeParametersSymbol] = _typeParameters;
    t.bindTypeParameters(this, WebsocketConnectionType);
    if (!restName) {
      throw new Error(`Invalid restName: "${restName}"`);
    }

    this.restName = restName;
  }

  createQuery(key) {
    let _keyType = t.string();

    t.param('key', _keyType).assert(key);

    logger.debug('createQuery', { key });
    return new Query(this, key);
  }

  emit(type, ...args) {
    logger.debug('emit', { type, args });
    if (this.connection.isDisconnected()) {
      throw new Error('Websocket is not connected');
    }

    return this.connection.emit('rest', {
      type,
      restName: this.restName,
      json: encode(args)
    }).then(function (result) {
      return result && decode(result);
    });
  }

  emitSubscribe(type, ...args) {
    var _this = this;

    const emit = function emit() {
      return _this.emit(type, ...args);
    };
    const registerOnConnect = function registerOnConnect() {
      _this.connection.on('connect', emit);
      return function () {
        return _this.connection.off('connect', emit);
      };
    };

    if (this.connection.isConnected()) {
      return emit().then(registerOnConnect);
    }

    return Promise.resolve(registerOnConnect());
  }

  insertOne(object) {
    let _objectType = t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    const _returnType = t.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    t.param('object', _objectType).assert(object);

    return this.emit('insertOne', object).then(function (_arg) {
      return _returnType.assert(_arg);
    });
  }

  updateOne(object) {
    let _objectType2 = t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    const _returnType2 = t.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    t.param('object', _objectType2).assert(object);

    return this.emit('updateOne', object).then(function (_arg2) {
      return _returnType2.assert(_arg2);
    });
  }

  updateSeveral(objects) {
    let _objectsType = t.array(t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType));

    const _returnType3 = t.return(t.array(this[_WebsocketStoreTypeParametersSymbol].ModelType));

    t.param('objects', _objectsType).assert(objects);

    return this.emit('updateSeveral', objects).then(function (_arg3) {
      return _returnType3.assert(_arg3);
    });
  }

  partialUpdateByKey(key, partialUpdate) {
    let _keyType2 = t.any();

    let _partialUpdateType = t.object();

    const _returnType4 = t.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    t.param('key', _keyType2).assert(key);
    t.param('partialUpdate', _partialUpdateType).assert(partialUpdate);

    return this.emit('partialUpdateByKey', key, partialUpdate).then(function (_arg4) {
      return _returnType4.assert(_arg4);
    });
  }

  partialUpdateOne(object, partialUpdate) {
    let _objectType3 = t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    let _partialUpdateType2 = t.object();

    const _returnType5 = t.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    t.param('object', _objectType3).assert(object);
    t.param('partialUpdate', _partialUpdateType2).assert(partialUpdate);

    return this.emit('partialUpdateOne', object, partialUpdate).then(function (_arg5) {
      return _returnType5.assert(_arg5);
    });
  }

  partialUpdateMany(criteria, partialUpdate) {
    let _partialUpdateType3 = t.object();

    const _returnType6 = t.return(t.void());

    t.param('partialUpdate', _partialUpdateType3).assert(partialUpdate);

    return this.emit('partialUpdateMany', criteria, partialUpdate).then(function (_arg6) {
      return _returnType6.assert(_arg6);
    });
  }

  deleteByKey(key) {
    let _keyType3 = t.any();

    const _returnType7 = t.return(t.void());

    t.param('key', _keyType3).assert(key);

    return this.emit('deleteByKey', key).then(function (_arg7) {
      return _returnType7.assert(_arg7);
    });
  }

  deleteOne(object) {
    let _objectType4 = t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    const _returnType8 = t.return(t.void());

    t.param('object', _objectType4).assert(object);

    return this.emit('deleteOne', object).then(function (_arg8) {
      return _returnType8.assert(_arg8);
    });
  }

  cursor(criteria, sort) {
    let _criteriaType = t.nullable(t.object());

    let _sortType = t.nullable(t.object());

    const _returnType9 = t.return(t.ref(WebsocketCursor, this[_WebsocketStoreTypeParametersSymbol].ModelType));

    t.param('criteria', _criteriaType).assert(criteria);
    t.param('sort', _sortType).assert(sort);

    return Promise.resolve(new WebsocketCursor(this, { criteria, sort })).then(function (_arg9) {
      return _returnType9.assert(_arg9);
    });
  }

  findByKey(key) {
    let _keyType4 = t.any();

    t.param('key', _keyType4).assert(key);

    return this.findOne({ id: key });
  }

  findOne(criteria, sort) {
    let _criteriaType2 = t.object();

    let _sortType2 = t.nullable(t.object());

    const _returnType10 = t.return(t.object());

    t.param('criteria', _criteriaType2).assert(criteria);
    t.param('sort', _sortType2).assert(sort);

    return this.emit('findOne', criteria, sort).then(function (_arg10) {
      return _returnType10.assert(_arg10);
    });
  }
}, _class[t.TypeParametersSymbol] = _WebsocketStoreTypeParametersSymbol, _temp);
export { WebsocketStore as default };
//# sourceMappingURL=WebsocketStore.js.map