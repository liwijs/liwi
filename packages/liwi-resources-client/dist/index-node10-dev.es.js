import { AbstractCursor, AbstractQuery } from 'liwi-store';
import Logger from 'nightingale-logger';
import { decode } from 'extended-json';

class ClientCursor extends AbstractCursor {
  constructor(client, options) {
    super(client);
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
    return super.store.createCursor(this.options).then(idCursor => {
      if (!idCursor) return;
      this._idCursor = idCursor;
    });
  }

  emit(type, ...args) {
    if (!this._idCursor) {
      return this._create().then(() => this.emit(type, ...args));
    }

    return super.store.send('cursor', {
      type,
      id: this._idCursor
    }, args);
  }

  advance(count) {
    this.emit('advance', count);
    return this;
  }

  async next() {
    const result = await this.emit('next');
    this._result = result;
    super.key = result && result[super.store.keyPath];
    return super.key;
  }

  result() {
    if (!this._result) throw new Error('Cannot call result() before next()');
    return Promise.resolve(this._result);
  }

  count(applyLimit = false) {
    return this.emit('count', applyLimit);
  }

  close() {
    if (!super.store) return Promise.resolve();
    const closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
    this._idCursor = undefined;
    this._result = undefined;
    return closedPromise;
  }

  toArray() {
    if (this._idCursor) throw new Error('Cursor created, cannot call toArray');
    return super.store.send('cursor toArray', this.options);
  }

}

const logger = new Logger('liwi:resources:query');
class Query extends AbstractQuery {
  constructor(client, key) {
    super();
    this.client = client;
    this.key = key;
  }

  fetch(onFulfilled) {
    return this.client.send('fetch', this.key).then(onFulfilled);
  }

  _subscribe(callback, _includeInitial = false, args) {
    const eventName = `subscribe:${this.client.resourceName}.${this.key}`;

    const listener = (err, result) => {
      const decodedResult = result && decode(result);
      logger.debug(eventName, {
        result,
        decodedResult
      });
      callback(err, decodedResult);
    };

    this.client.on(eventName, listener);

    let _stopEmitSubscribe;

    let promise = this.client.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', this.key, eventName, args).then(stopEmitSubscribe => {
      _stopEmitSubscribe = stopEmitSubscribe;
      logger.info('subscribed');
    }).catch(err => {
      this.client.off(eventName, listener);
      throw err;
    });

    const stop = () => {
      if (!promise) return;

      _stopEmitSubscribe();

      promise.then(() => {
        promise = undefined;
        this.client.off(eventName, listener);
      });
    };

    return {
      cancel: stop,
      stop,
      then: cb => Promise.resolve(promise).then(cb)
    };
  }

}

class AbstractClient {
  constructor(resourceName, keyPath) {
    this.resourceName = resourceName;

    if (!resourceName) {
      throw new Error(`Invalid resourceName: "${resourceName}"`);
    }

    this.keyPath = keyPath;
  }

  createQuery(key) {
    return new Query(this, key);
  }

  cursor(criteria, sort) {
    return Promise.resolve(new ClientCursor(this, {
      criteria,
      sort
    }));
  }

  findAll(criteria, sort) {
    return this.send('cursor toArray', {
      criteria,
      sort
    });
  }

  findByKey(key) {
    return this.send('findByKey', key);
  }

  findOne(criteria, sort) {
    return this.send('findOne', criteria, sort);
  }

  upsertOne(object) {
    return this.send('upsertOne', object);
  }

  insertOne(object) {
    return this.send('insertOne', object);
  }

  replaceOne(object) {
    return this.send('replaceOne', object);
  }

  replaceSeveral(objects) {
    return this.send('replaceSeveral', objects);
  }

  upsertOneWithInfo(object) {
    return this.send('upsertOneWithInfo', object);
  }

  partialUpdateByKey(key, partialUpdate) {
    return this.send('partialUpdateByKey', key, partialUpdate);
  }

  partialUpdateOne(object, partialUpdate) {
    return this.partialUpdateByKey(object[this.keyPath], partialUpdate);
  }

  partialUpdateMany(criteria, partialUpdate) {
    return this.send('partialUpdateMany', criteria, partialUpdate);
  }

  deleteByKey(key) {
    return this.send('deleteByKey', key);
  }

  deleteOne(object) {
    return this.send('deleteByKey', object[this.keyPath]);
  }

  deleteMany(criteria) {
    return this.send('deleteMany', criteria);
  }

}

export { AbstractClient };
//# sourceMappingURL=index-node10-dev.es.js.map
