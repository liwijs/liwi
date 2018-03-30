'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var liwiStore = require('liwi-store');
var Logger = _interopDefault(require('nightingale-logger'));
var extendedJson = require('extended-json');

let WebsocketCursor = class extends liwiStore.AbstractCursor {

  constructor(store, options) {
    super(store);
    this._options = options;
  }

  /* options */

  limit(newLimit) {
    if (this._idCursor) throw new Error('Cursor already created');
    this._options.limit = newLimit;
    return Promise.resolve(this);
  }

  /* results */

  _create() {
    if (this._idCursor) throw new Error('Cursor already created');
    return this.store.connection.emit('createCursor', this._options).then(idCursor => {
      if (!idCursor) return;
      this._idCursor = idCursor;
    });
  }

  emit(type, ...args) {
    if (!this._idCursor) {
      return this._create().then(() => this.emit(type, ...args));
    }

    return this.store.emit('cursor', { type, id: this._idCursor }, args);
  }

  advance(count) {
    this.emit('advance', count);
    return this;
  }

  next() {
    return this.emit('next').then(result => {
      this._result = result;
      this.key = result && result[this._store.keyPath];
      return this.key;
    });
  }

  result() {
    return Promise.resolve(this._result);
  }

  count(applyLimit = false) {
    return this.emit('count', applyLimit);
  }

  close() {
    if (!this._store) return Promise.resolve();

    const closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
    this._idCursor = null;
    this._options = null;
    this._store = undefined;
    this._result = undefined;
    return closedPromise;
  }

  toArray() {
    return this.store.emit('cursor toArray', this._options).then(result => {
      this.close();
      return result;
    });
  }
};

const logger = new Logger('liwi:websocket-client:query');

let Query = class extends liwiStore.AbstractQuery {
  constructor(store, key) {
    super(store);
    this.key = key;
  }

  fetch(callback) {
    return this.store.emit('fetch', this.key).then(callback);
  }

  _subscribe(callback, _includeInitial = false, args) {
    const eventName = `subscribe:${this.store.restName}.${this.key}`;
    const listener = (err, result) => {
      const decodedResult = result && extendedJson.decode(result);

      callback(err, decodedResult);
    };
    this.store.connection.on(eventName, listener);

    let _stopEmitSubscribe;
    let promise = this.store.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', this.key, eventName, args).then(stopEmitSubscribe => {
      _stopEmitSubscribe = stopEmitSubscribe;
      logger.info('subscribed');
    }).catch(err => {
      this.store.connection.off(eventName, listener);
      throw err;
    });

    const stop = () => {
      if (!promise) return;
      _stopEmitSubscribe();
      promise.then(() => {
        promise = null;
        this.store.connection.off(eventName, listener);
      });
    };

    return {
      cancel: stop,
      stop,
      then: cb => Promise.resolve(promise).then(cb)
    };
  }
};

const logger$1 = new Logger('liwi:websocket-client');

let WebsocketStore = class extends liwiStore.AbstractStore {

  constructor(websocket, restName) {
    super(websocket);

    this.keyPath = 'id';
    if (!restName) {
      throw new Error(`Invalid restName: "${restName}"`);
    }

    this.restName = restName;
  }

  createQuery(key) {
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
      json: extendedJson.encode(args)
    }).then(result => result && extendedJson.decode(result));
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
    return this.emit('insertOne', object);
  }

  updateOne(object) {
    return this.emit('updateOne', object);
  }

  updateSeveral(objects) {
    return this.emit('updateSeveral', objects);
  }

  partialUpdateByKey(key, partialUpdate) {
    return this.emit('partialUpdateByKey', key, partialUpdate);
  }

  partialUpdateOne(object, partialUpdate) {
    return this.emit('partialUpdateOne', object, partialUpdate);
  }

  partialUpdateMany(criteria, partialUpdate) {
    return this.emit('partialUpdateMany', criteria, partialUpdate);
  }

  deleteByKey(key) {
    return this.emit('deleteByKey', key);
  }

  deleteOne(object) {
    return this.emit('deleteOne', object);
  }

  cursor(criteria, sort) {
    return Promise.resolve(new WebsocketCursor(this, { criteria, sort }));
  }

  findByKey(key) {
    return this.findOne({ id: key });
  }

  findOne(criteria, sort) {
    return this.emit('findOne', criteria, sort);
  }
};

exports.WebsocketStore = WebsocketStore;
exports.WebsocketCursor = WebsocketCursor;
//# sourceMappingURL=index-node8.cjs.js.map
