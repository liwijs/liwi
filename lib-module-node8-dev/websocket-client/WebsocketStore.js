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

    if (t.param('websocket', WebsocketConnectionType).assert(websocket), t.param('restName', _restNameType).assert(restName), super(websocket), this.keyPath = 'id', this[_WebsocketStoreTypeParametersSymbol] = _typeParameters, t.bindTypeParameters(this, WebsocketConnectionType), !restName) throw new Error(`Invalid restName: "${restName}"`);

    this.restName = restName;
  }

  createQuery(key) {
    let _keyType = t.string();

    return t.param('key', _keyType).assert(key), logger.debug('createQuery', { key }), new Query(this, key);
  }

  emit(type, ...args) {
    if (logger.debug('emit', { type, args }), this.connection.isDisconnected()) throw new Error('Websocket is not connected');

    return this.connection.emit('rest', {
      type,
      restName: this.restName,
      json: encode(args)
    }).then(result => result && decode(result));
  }

  emitSubscribe(type, ...args) {
    const emit = () => this.emit(type, ...args);
    return emit().then(() => (this.connection.on('reconnect', emit), () => this.connection.off('reconnect', emit)));
  }

  insertOne(object) {
    let _objectType = t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    const _returnType = t.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    return t.param('object', _objectType).assert(object), this.emit('insertOne', object).then(_arg => _returnType.assert(_arg));
  }

  updateOne(object) {
    let _objectType2 = t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    const _returnType2 = t.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    return t.param('object', _objectType2).assert(object), this.emit('updateOne', object).then(_arg2 => _returnType2.assert(_arg2));
  }

  updateSeveral(objects) {
    let _objectsType = t.array(t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType));

    const _returnType3 = t.return(t.array(this[_WebsocketStoreTypeParametersSymbol].ModelType));

    return t.param('objects', _objectsType).assert(objects), this.emit('updateSeveral', objects).then(_arg3 => _returnType3.assert(_arg3));
  }

  partialUpdateByKey(key, partialUpdate) {
    let _keyType2 = t.any();

    let _partialUpdateType = t.object();

    const _returnType4 = t.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    return t.param('key', _keyType2).assert(key), t.param('partialUpdate', _partialUpdateType).assert(partialUpdate), this.emit('partialUpdateByKey', key, partialUpdate).then(_arg4 => _returnType4.assert(_arg4));
  }

  partialUpdateOne(object, partialUpdate) {
    let _objectType3 = t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    let _partialUpdateType2 = t.object();

    const _returnType5 = t.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    return t.param('object', _objectType3).assert(object), t.param('partialUpdate', _partialUpdateType2).assert(partialUpdate), this.emit('partialUpdateOne', object, partialUpdate).then(_arg5 => _returnType5.assert(_arg5));
  }

  partialUpdateMany(criteria, partialUpdate) {
    let _partialUpdateType3 = t.object();

    const _returnType6 = t.return(t.void());

    return t.param('partialUpdate', _partialUpdateType3).assert(partialUpdate), this.emit('partialUpdateMany', criteria, partialUpdate).then(_arg6 => _returnType6.assert(_arg6));
  }

  deleteByKey(key) {
    let _keyType3 = t.any();

    const _returnType7 = t.return(t.void());

    return t.param('key', _keyType3).assert(key), this.emit('deleteByKey', key).then(_arg7 => _returnType7.assert(_arg7));
  }

  deleteOne(object) {
    let _objectType4 = t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

    const _returnType8 = t.return(t.void());

    return t.param('object', _objectType4).assert(object), this.emit('deleteOne', object).then(_arg8 => _returnType8.assert(_arg8));
  }

  cursor(criteria, sort) {
    let _criteriaType = t.nullable(t.object());

    let _sortType = t.nullable(t.object());

    const _returnType9 = t.return(t.ref(WebsocketCursor, this[_WebsocketStoreTypeParametersSymbol].ModelType));

    return t.param('criteria', _criteriaType).assert(criteria), t.param('sort', _sortType).assert(sort), Promise.resolve(new WebsocketCursor(this, { criteria, sort })).then(_arg9 => _returnType9.assert(_arg9));
  }

  findByKey(key) {
    let _keyType4 = t.any();

    return t.param('key', _keyType4).assert(key), this.findOne({ id: key });
  }

  findOne(criteria, sort) {
    let _criteriaType2 = t.object();

    let _sortType2 = t.nullable(t.object());

    const _returnType10 = t.return(t.object());

    return t.param('criteria', _criteriaType2).assert(criteria), t.param('sort', _sortType2).assert(sort), this.emit('findOne', criteria, sort).then(_arg10 => _returnType10.assert(_arg10));
  }
}, _class[t.TypeParametersSymbol] = _WebsocketStoreTypeParametersSymbol, _temp);
export { WebsocketStore as default };
//# sourceMappingURL=WebsocketStore.js.map