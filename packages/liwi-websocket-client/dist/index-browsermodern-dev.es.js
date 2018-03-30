import { AbstractCursor, ResultType, AbstractQuery, AbstractStore } from 'liwi-store';
import t from 'flow-runtime';
import Logger from 'nightingale-logger';
import { decode, encode } from 'extended-json';

const ResultType$1 = t.tdz(function () {
  return ResultType;
});
let WebsocketCursor = class extends AbstractCursor {

  constructor(store, options) {
    let _storeType = t.ref(WebsocketStore);

    t.param('store', _storeType).assert(store);

    super(store);
    t.bindTypeParameters(this, t.ref(WebsocketStore));
    this._options = options;
  }

  /* options */

  limit(newLimit) {
    let _newLimitType = t.number();

    const _returnType = t.return(t.this(this));

    t.param('newLimit', _newLimitType).assert(newLimit);

    if (this._idCursor) throw new Error('Cursor already created');
    this._options.limit = newLimit;
    return Promise.resolve(this).then(function (_arg) {
      return _returnType.assert(_arg);
    });
  }

  /* results */

  _create() {
    var _this = this;

    if (this._idCursor) throw new Error('Cursor already created');
    return this.store.connection.emit('createCursor', this._options).then(function (idCursor) {
      if (!idCursor) return;
      _this._idCursor = idCursor;
    });
  }

  emit(type, ...args) {
    var _this2 = this;

    const _returnType2 = t.return(t.any());

    if (!this._idCursor) {
      return this._create().then(function () {
        return _this2.emit(type, ...args);
      }).then(function (_arg2) {
        return _returnType2.assert(_arg2);
      });
    }

    return this.store.emit('cursor', { type, id: this._idCursor }, args).then(function (_arg3) {
      return _returnType2.assert(_arg3);
    });
  }

  advance(count) {
    let _countType = t.number();

    t.param('count', _countType).assert(count);

    this.emit('advance', count);
    return this;
  }

  next() {
    var _this3 = this;

    const _returnType3 = t.return(t.nullable(t.any()));

    return this.emit('next').then(function (result) {
      _this3._result = result;
      _this3.key = result && result[_this3._store.keyPath];
      return _this3.key;
    }).then(function (_arg4) {
      return _returnType3.assert(_arg4);
    });
  }

  result() {
    const _returnType4 = t.return(t.nullable(t.ref(ResultType$1)));

    return Promise.resolve(this._result).then(function (_arg5) {
      return _returnType4.assert(_arg5);
    });
  }

  count(applyLimit = false) {
    let _applyLimitType = t.boolean();

    t.param('applyLimit', _applyLimitType).assert(applyLimit);

    return this.emit('count', applyLimit);
  }

  close() {
    const _returnType5 = t.return(t.void());

    if (!this._store) return Promise.resolve().then(function (_arg6) {
      return _returnType5.assert(_arg6);
    });

    const closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
    this._idCursor = null;
    this._options = null;
    this._store = undefined;
    this._result = undefined;
    return closedPromise.then(function (_arg7) {
      return _returnType5.assert(_arg7);
    });
  }

  toArray() {
    var _this4 = this;

    const _returnType6 = t.return(t.array(t.array(t.ref(ResultType$1))));

    return this.store.emit('cursor toArray', this._options).then(function (result) {
      _this4.close();
      return result;
    }).then(function (_arg8) {
      return _returnType6.assert(_arg8);
    });
  }
};

const SubscribeReturnType = t.type('SubscribeReturnType', t.object(t.property('cancel', t.function()), t.property('stop', t.function())));


const logger = new Logger('liwi:websocket-client:query');

let Query = class extends AbstractQuery {
  constructor(store, key) {
    let _storeType = t.ref(WebsocketStore);

    let _keyType = t.string();

    t.param('store', _storeType).assert(store);
    t.param('key', _keyType).assert(key);

    super(store);
    t.bindTypeParameters(this, t.ref(WebsocketStore));
    this.key = key;
  }

  fetch(callback) {
    let _callbackType = t.nullable(t.function());

    const _returnType = t.return(t.any());

    t.param('callback', _callbackType).assert(callback);

    return this.store.emit('fetch', this.key).then(callback).then(function (_arg) {
      return _returnType.assert(_arg);
    });
  }

  _subscribe(callback, _includeInitial = false, args) {
    var _this = this;

    let _callbackType2 = t.function();

    let _argsType = t.array(t.any());

    const _returnType2 = t.return(SubscribeReturnType);

    t.param('callback', _callbackType2).assert(callback);
    t.param('args', _argsType).assert(args);

    const eventName = `subscribe:${this.store.restName}.${this.key}`;
    const listener = function listener(err, result) {
      const decodedResult = result && decode(result);
      logger.debug(eventName, { result, decodedResult });
      callback(err, decodedResult);
    };
    this.store.connection.on(eventName, listener);

    let _stopEmitSubscribe;
    let promise = this.store.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', this.key, eventName, args).then(function (stopEmitSubscribe) {
      _stopEmitSubscribe = stopEmitSubscribe;
      logger.info('subscribed');
    }).catch(function (err) {
      _this.store.connection.off(eventName, listener);
      throw err;
    });

    const stop = function stop() {
      if (!promise) return;
      _stopEmitSubscribe();
      promise.then(function () {
        promise = null;
        _this.store.connection.off(eventName, listener);
      });
    };

    return _returnType2.assert({
      cancel: stop,
      stop,
      then: function then(cb) {
        return Promise.resolve(promise).then(cb);
      }
    });
  }
};

var _class, _temp;
const logger$1 = new Logger('liwi:websocket-client');

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

    logger$1.debug('createQuery', { key });
    return new Query(this, key);
  }

  emit(type, ...args) {
    logger$1.debug('emit', { type, args });
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

export { WebsocketStore, WebsocketCursor };
//# sourceMappingURL=index-browsermodern-dev.es.js.map
