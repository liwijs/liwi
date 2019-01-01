import Logger from 'nightingale-logger';
import { decode, encode } from 'extended-json';
import { AbstractCursor, AbstractQuery, AbstractStore } from 'liwi-store';

class WebsocketCursor extends AbstractCursor {
  constructor(store, options) {
    super(store);
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
    var _this = this;

    if (this._idCursor) throw new Error('Cursor already created');
    return this.store.connection.emit('createCursor', this.options).then(function (idCursor) {
      if (!idCursor) return;
      _this._idCursor = idCursor;
    });
  }

  emit(type, ...args) {
    var _this2 = this;

    if (!this._idCursor) {
      return this._create().then(function () {
        return _this2.emit(type, ...args);
      });
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
    var _this3 = this;

    return this.emit('next').then(function (result) {
      _this3._result = result;
      _this3.key = result && result[_this3._store.keyPath];
      return _this3.key;
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
    var _this4 = this;

    return this.store.emit('cursor toArray', this.options).then(function (result) {
      _this4.close();

      return result;
    });
  }

}

const logger = new Logger('liwi:websocket-client:query');
class Query extends AbstractQuery {
  constructor(store, key) {
    super(store);
    this.key = key;
  }

  fetch(onFulfilled) {
    return super.store.emit('fetch', this.key).then(onFulfilled);
  }

  _subscribe(callback, _includeInitial = false, args) {
    const eventName = `subscribe:${super.store.restName}.${this.key}`;

    const listener = function listener(err, result) {
      const decodedResult = result && decode(result);
      callback(err, decodedResult);
    };

    const connection = super.store.connection;
    connection.on(eventName, listener);

    let _stopEmitSubscribe;

    let promise = super.store.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', this.key, eventName, args).then(function (stopEmitSubscribe) {
      _stopEmitSubscribe = stopEmitSubscribe;
      logger.info('subscribed');
    }).catch(function (err) {
      connection.off(eventName, listener);
      throw err;
    });

    const stop = function stop() {
      if (!promise) return;

      _stopEmitSubscribe();

      promise.then(function () {
        promise = undefined;
        connection.off(eventName, listener);
      });
    };

    return {
      cancel: stop,
      stop,
      then: function then(cb) {
        return Promise.resolve(promise).then(cb);
      }
    };
  }

}

const logger$1 = new Logger('liwi:websocket-client');
class WebsocketStore extends AbstractStore {
  constructor(websocket, restName, keyPath) {
    super(websocket, keyPath);

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
    var _this = this;

    const connection = super.connection;

    const emit = function emit() {
      return _this.emit(type, ...args);
    };

    const registerOnConnect = function registerOnConnect() {
      connection.on('connect', emit);
      return function () {
        connection.off('connect', emit);
      };
    };

    if (connection.isConnected()) {
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

  replaceSeveral(objects) {
    return this.emit('replaceSeveral', objects);
  }

  upsertOneWithInfo(object) {
    return this.emit('upsertOneWithInfo', object);
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

  cursor(criteria, sort) {
    return Promise.resolve(new WebsocketCursor(this, {
      criteria,
      sort
    }));
  }

  findByKey(key) {
    return this.findOne({
      [super.keyPath]: key
    });
  }

  findOne(criteria, sort) {
    return this.emit('findOne', criteria, sort);
  }

  deleteByKey(key) {
    return this.emit('deleteByKey', key);
  }

  deleteMany(criteria) {
    return this.emit('deleteMany', criteria);
  }

  emit(type, ...args) {
    logger$1.debug('emit', {
      type,
      args
    });

    if (super.connection.isDisconnected()) {
      throw new Error('Websocket is not connected');
    }

    return super.connection.emit('rest', {
      type,
      restName: this.restName,
      json: encode(args)
    }).then(function (result) {
      return result && decode(result);
    });
  }

}

export { WebsocketStore, WebsocketCursor };
//# sourceMappingURL=index-browsermodern.es.js.map
