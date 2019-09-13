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
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  callSubscribed(action) {
    this.listeners.forEach(listener => listener(action));
  }

  createQuery(options, transformer) {
    const query = this.store.createQuery(options, transformer);
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

  async partialUpdateByKey(key, partialUpdate, criteria) {
    return this.partialUpdateOne((await this.findOne({
      [this.store.keyPath]: key,
      ...criteria
    })), partialUpdate);
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

  async partialUpdateMany(criteria, partialUpdate) {
    const cursor = await this.store.cursor(criteria);
    const prev = [];
    const next = [];
    await cursor.forEach(async model => {
      const key = model[this.store.keyPath];
      const updated = await this.store.partialUpdateByKey(key, partialUpdate, criteria);
      prev.push(model);
      next.push(updated);
    });
    this.callSubscribed({
      type: 'updated',
      prev,
      next
    });
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

  async deleteMany(criteria) {
    const cursor = await this.store.cursor(criteria);
    const prev = await cursor.toArray();
    await this.store.deleteMany(criteria);
    this.callSubscribed({
      type: 'deleted',
      prev
    });
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

export { AbstractSubscribeQuery, SubscribeStore };
//# sourceMappingURL=index-node10-dev.es.js.map
