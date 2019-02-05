import { AbstractQuery } from 'liwi-store';

class SubscribeStore {
  constructor(store) {
    this.listeners = new Set();
    this.store = store;
  }

  get keyPath() {
    return this.store.keyPath;
  }

  get connection() {
    return this.store.connection;
  }

  subscribe(callback) {
    var _this = this;

    this.listeners.add(callback);
    return function () {
      return _this.listeners.delete(callback);
    };
  }

  callSubscribed(action) {
    this.listeners.forEach(function (listener) {
      return listener(action);
    });
  }

  createQuery(options) {
    const query = this.store.createQuery(options);
    query.setSubscribeStore(this);
    return query;
  }

  findAll(criteria, sort) {
    return this.store.findAll(criteria, sort);
  }

  findByKey(key) {
    return this.store.findByKey(key);
  }

  findOne(criteria, sort) {
    return this.store.findOne(criteria, sort);
  }

  async insertOne(object) {
    const inserted = await this.store.insertOne(object);
    this.callSubscribed({
      type: 'inserted',
      next: [inserted]
    });
    return inserted;
  }

  async replaceOne(object) {
    const replaced = await this.store.replaceOne(object);
    this.callSubscribed({
      type: 'updated',
      prev: [object],
      next: [replaced]
    });
    return replaced;
  }

  async replaceSeveral(objects) {
    const replacedObjects = await this.store.replaceSeveral(objects);
    this.callSubscribed({
      type: 'updated',
      prev: objects,
      next: replacedObjects
    });
    return replacedObjects;
  }

  async upsertOne(object) {
    const result = await this.upsertOneWithInfo(object);
    return result.object;
  }

  async upsertOneWithInfo(object) {
    const upsertedWithInfo = await this.store.upsertOneWithInfo(object);

    if (upsertedWithInfo.inserted) {
      this.callSubscribed({
        type: 'inserted',
        next: [upsertedWithInfo.object]
      });
    } else {
      throw new Error('TODO');
    }

    return upsertedWithInfo;
  }

  async partialUpdateByKey(key, partialUpdate) {
    return this.partialUpdateOne((await this.findByKey(key)), partialUpdate);
  }

  async partialUpdateOne(object, partialUpdate) {
    const updated = await this.store.partialUpdateOne(object, partialUpdate);
    this.callSubscribed({
      type: 'updated',
      prev: [object],
      next: [updated]
    });
    return updated;
  }

  partialUpdateMany() {
    throw new Error('partialUpdateMany cannot be used in SubscribeStore'); // return this.store.partialUpdateMany(criteria, partialUpdate);
  }

  async deleteByKey(key) {
    return this.deleteOne((await this.findByKey(key)));
  }

  async deleteOne(object) {
    await this.store.deleteOne(object);
    this.callSubscribed({
      type: 'deleted',
      prev: [object]
    });
  }

  deleteMany() {
    throw new Error('deleteMany cannot be used in SubscribeStore');
  }

  async cursor(criteria, sort) {
    const cursor = await this.store.cursor(criteria, sort);
    cursor.overrideStore(this);
    return cursor;
  }

}

class AbstractSubscribeQuery extends AbstractQuery {
  setSubscribeStore(store) {
    this._subscribeStore = store;
  }

  getSubscribeStore() {
    if (!this._subscribeStore) {
      throw new Error('_subscribeStore is not initialized');
    }

    return this._subscribeStore;
  }

}

export { SubscribeStore, AbstractSubscribeQuery };
//# sourceMappingURL=index-browsermodern-dev.es.js.map
