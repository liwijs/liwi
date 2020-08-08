class AbstractSubscribableStoreQuery {
  changePartialParams() {
    throw new Error('Method not supported. Please create a new query.');
  }

  setSubscribeStore(store) {
    this._subscribeStore = store;
  }

  getSubscribeStore() {
    if (!this._subscribeStore) {
      throw new Error('_subscribeStore is not initialized');
    }

    return this._subscribeStore;
  }

  fetchAndSubscribe(callback) {
    return this._subscribe(callback, true);
  }

  subscribe(callback) {
    return this._subscribe(callback, false);
  }

}

/* eslint-disable max-lines */
class SubscribeStore {
  constructor(store) {
    this.listeners = new Set();
    this.store = store;
    this.keyPath = store.keyPath;
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

  createQuerySingleItem(options, transformer) {
    const query = this.store.createQuerySingleItem(options, transformer);
    query.setSubscribeStore(this);
    return query;
  }

  createQueryCollection(options, transformer) {
    const query = this.store.createQueryCollection(options, transformer);
    query.setSubscribeStore(this);
    return query;
  }

  findAll(criteria, sort) {
    return this.store.findAll(criteria, sort);
  }

  findByKey(key, criteria) {
    return this.store.findByKey(key, criteria);
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
      changes: [[object, replaced]]
    });
    return replaced;
  }

  async replaceSeveral(objects) {
    const replacedObjects = await this.store.replaceSeveral(objects);
    this.callSubscribed({
      type: 'updated',
      changes: objects.map(function (prev, index) {
        return [prev, replacedObjects[index]];
      })
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
    return this.partialUpdateOne(await this.findOne(Object.assign({
      [this.store.keyPath]: key
    }, criteria)), partialUpdate);
  }

  async partialUpdateOne(object, partialUpdate) {
    const updated = await this.store.partialUpdateOne(object, partialUpdate);
    this.callSubscribed({
      type: 'updated',
      changes: [[object, updated]]
    });
    return updated;
  }

  async partialUpdateMany(criteria, partialUpdate) {
    var _this2 = this;

    const cursor = await this.store.cursor(criteria);
    const changes = [];
    await cursor.forEach(async function (model) {
      const key = model[_this2.store.keyPath];
      const updated = await _this2.store.partialUpdateByKey(key, partialUpdate, criteria);
      changes.push([model, updated]);
    });
    this.callSubscribed({
      type: 'updated',
      changes
    });
  }

  async deleteByKey(key, criteria) {
    return this.deleteOne(await this.findByKey(key, criteria));
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

export { AbstractSubscribableStoreQuery, SubscribeStore };
//# sourceMappingURL=index-browsermodern-dev.es.js.map
