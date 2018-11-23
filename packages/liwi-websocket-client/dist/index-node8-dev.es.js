import Logger from 'nightingale-logger';
import { decode, encode } from 'extended-json';
import { AbstractCursor, AbstractQuery, AbstractStore } from 'liwi-store';

class WebsocketCursor extends AbstractCursor {
  constructor(store, options) {
    super(store);
    this._idCursor = void 0;
    this.options = void 0;
    this._result = void 0;
    this.options = options;
  }
  /* options */


  limit(newLimit) {
    if (this._idCursor) throw new Error('Cursor already created');
    this.options.limit = newLimit;
    return Promise.resolve(this);
  }
  /* results */


  _create() {
    if (this._idCursor) throw new Error('Cursor already created');
    return this.store.connection.emit('createCursor', this.options).then(idCursor => {
      if (!idCursor) return;
      this._idCursor = idCursor;
    });
  }

  emit(type, ...args) {
    if (!this._idCursor) {
      return this._create().then(() => this.emit(type, ...args));
    }

    return this.store.emit('cursor', {
      type,
      id: this._idCursor
    }, args);
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
    if (!this._result) throw new Error('Cannot call result() before next()');
    return Promise.resolve(this._result);
  }

  count(applyLimit = false) {
    return this.emit('count', applyLimit);
  }

  close() {
    if (!this._store) return Promise.resolve();
    const closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
    this._idCursor = undefined;
    this._result = undefined;
    return closedPromise;
  }

  toArray() {
    return this.store.emit('cursor toArray', this.options).then(result => {
      this.close();
      return result;
    });
  }

}

const logger = new Logger('liwi:websocket-client:query');
class Query extends AbstractQuery {
  constructor(store, key) {
    super(store);
    this.key = void 0;
    this.key = key;
  }

  fetch(onFulfilled) {
    return this.store.emit('fetch', this.key).then(onFulfilled);
  }

  _subscribe(callback, _includeInitial = false, args) {
    const eventName = `subscribe:${this.store.restName}.${this.key}`;

    const listener = (err, result) => {
      const decodedResult = result && decode(result);
      logger.debug(eventName, {
        result,
        decodedResult
      });
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
        promise = undefined;
        this.store.connection.off(eventName, listener);
      });
    };

    return {
      cancel: stop,
      stop,
      then: cb => Promise.resolve(promise).then(cb)
    };
  }

}

const logger$1 = new Logger('liwi:websocket-client');
class WebsocketStore extends AbstractStore {
  constructor(websocket, restName, keyPath) {
    super(websocket, keyPath);
    this.restName = void 0;

    if (!restName) {
      throw new Error(`Invalid restName: "${restName}"`);
    }

    this.restName = restName;
  }

  createQuery(key) {
    logger$1.debug('createQuery', {
      key
    });
    return new Query(this, key);
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

  replaceOne(object) {
    return this.emit('replaceOne', object);
  }

  upsertOne(object) {
    return this.emit('upsertOne', object);
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
    return Promise.resolve(new WebsocketCursor(this, {
      criteria,
      sort
    }));
  }

  findByKey(key) {
    return this.findOne({
      [this.keyPath]: key
    });
  }

  findOne(criteria, sort) {
    return this.emit('findOne', criteria, sort);
  }

  emit(type, ...args) {
    logger$1.debug('emit', {
      type,
      args
    });

    if (this.connection.isDisconnected()) {
      throw new Error('Websocket is not connected');
    }

    return this.connection.emit('rest', {
      type,
      restName: this.restName,
      json: encode(args)
    }).then(result => result && decode(result));
  }

}

export { WebsocketStore, WebsocketCursor };
//# sourceMappingURL=index-node8-dev.es.js.map
