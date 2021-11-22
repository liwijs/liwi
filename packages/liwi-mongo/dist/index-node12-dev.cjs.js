'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const mongodb = require('mongodb');
const liwiStore = require('liwi-store');
const liwiSubscribeStore = require('liwi-subscribe-store');
const mingo = require('mingo');
const Logger = require('nightingale-logger');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const mongodb__default = /*#__PURE__*/_interopDefaultLegacy(mongodb);
const mingo__default = /*#__PURE__*/_interopDefaultLegacy(mingo);
const Logger__default = /*#__PURE__*/_interopDefaultLegacy(Logger);

class MongoCursor extends liwiStore.AbstractStoreCursor {
  // key in AbstractCursor
  constructor(store, cursor) {
    super(store);
    this.cursor = cursor;
  }

  advance(count) {
    this.cursor.skip(count);
  }

  next() {
    return this.cursor.next().then(value => {
      this._result = value;
      this.key = value === null || value === void 0 ? void 0 : value._id;
      return this.key;
    });
  }

  limit(newLimit) {
    this.cursor.limit(newLimit);
    return Promise.resolve(this);
  }

  count(applySkipLimit = false) {
    return this.cursor.count(applySkipLimit);
  }

  result() {
    if (!this._result) throw new Error('Cannot call result() before next()');
    return Promise.resolve(this._result);
  }

  close() {
    if (this.cursor) {
      this.cursor.close();
    }

    return Promise.resolve();
  }

  toArray() {
    return this.cursor.toArray();
  }

}

/* eslint-disable complexity, max-lines */

const identityTransformer$1 = model => model;

class MongoQueryCollection extends liwiSubscribeStore.AbstractSubscribableStoreQuery {
  constructor(store, options, transformer = identityTransformer$1) {
    super();
    this.store = store;
    this.options = options;
    this.transformer = transformer;
  }

  createTestCriteria() {
    if (!this.testCriteria) {
      if (!this.options.criteria) {
        return () => true;
      }

      const mingoQuery = new mingo__default.Query(this.options.criteria);
      this.testCriteria = mingoQuery.test.bind(mingoQuery);
    }

    return this.testCriteria;
  }

  async fetch(onFulfilled) {
    const cursor = await this.createMongoCursor();
    const [result, count] = await Promise.all([cursor.toArray(), cursor.count()]);
    return onFulfilled({
      result: result.map(this.transformer),
      meta: {
        total: count
      },
      info: {
        sort: this.options.sort,
        limit: this.options.limit,
        keyPath: this.store.keyPath
      }
    });
  }

  _subscribe(callback, _includeInitial) {
    const store = super.getSubscribeStore();
    const testCriteria = this.createTestCriteria();
    const promise = _includeInitial ? this.fetch(({
      result,
      meta,
      info
    }) => {
      callback(null, [{
        type: 'initial',
        initial: result,
        queryInfo: info,
        meta
      }]);
    }) : Promise.resolve();
    const unsubscribe = store.subscribe(action => {
      const changes = [];

      switch (action.type) {
        case 'inserted':
          {
            const filtered = action.next.filter(testCriteria);

            if (filtered.length > 0) {
              changes.push({
                type: 'inserted',
                result: filtered.map(this.transformer)
              });
            }

            break;
          }

        case 'deleted':
          {
            const filtered = action.prev.filter(testCriteria);

            if (filtered.length > 0) {
              changes.push({
                type: 'deleted',
                keys: filtered.map(object => object[this.store.keyPath])
              });
            }

            break;
          }

        case 'updated':
          {
            const {
              deleted,
              updated,
              inserted
            } = action.changes.reduce((acc, [prevObject, nextObject]) => {
              if (testCriteria(prevObject)) {
                if (!testCriteria(nextObject)) {
                  acc.deleted.push(prevObject[this.store.keyPath]);
                } else {
                  acc.updated.push(this.transformer(nextObject));
                }
              } else if (testCriteria(nextObject)) {
                acc.inserted.push(this.transformer(nextObject));
              }

              return acc;
            }, {
              deleted: [],
              updated: [],
              inserted: []
            });

            if (deleted.length > 0) {
              changes.push({
                type: 'deleted',
                keys: deleted
              });
            }

            if (updated.length > 0) {
              changes.push({
                type: 'updated',
                result: updated
              });
            }

            if (inserted.length > 0) {
              changes.push({
                type: 'inserted',
                result: inserted
              });
            }

            break;
          }

        default:
          throw new Error('Unsupported type');
      }

      if (changes.length === 0) return;
      callback(null, changes);
    }); // let _feed;
    // const promise = this.queryCallback(this.store.query(), this.store.r)
    //   .changes({
    //     includeInitial: _includeInitial,
    //     includeStates: true,
    //     includeTypes: true,
    //     includeOffsets: true,
    //   })
    //   .then((feed) => {
    //     if (args.length === 0) {
    //       _feed = feed;
    //       delete this._promise;
    //     }
    //
    //     feed.each(callback);
    //     return feed;
    //   });
    //
    // if (args.length === 0) this._promise = promise;

    return {
      stop: unsubscribe,
      cancel: unsubscribe,
      then: (onFulfilled, onRejected) => promise.then(onFulfilled, onRejected)
    };
  }

  async createMongoCursor() {
    const cursor = await this.store.cursor(this.options.criteria, this.options.sort);

    if (this.options.skip) {
      cursor.advance(this.options.skip);
    }

    if (this.options.limit) {
      await cursor.limit(this.options.limit);
    }

    return cursor;
  }

}

const identityTransformer = model => model;

class MongoQuerySingleItem extends liwiSubscribeStore.AbstractSubscribableStoreQuery {
  constructor(store, options, transformer = identityTransformer) {
    super();
    this.store = store;
    this.options = options;
    this.transformer = transformer;
  }

  createMingoQuery() {
    if (!this.mingoQuery) {
      if (!this.options.criteria) {
        return {
          test: () => true
        };
      }

      this.mingoQuery = new mingo__default.Query(this.options.criteria);
    }

    return this.mingoQuery;
  }

  async fetch(onFulfilled) {
    const cursor = await this.createMongoCursor();
    await cursor.limit(1);
    return cursor.toArray().then(result => {
      const item = result.length === 0 ? null : this.transformer(result[0]);
      return onFulfilled({
        result: item,
        meta: {
          total: result === null ? 0 : 1
        },
        info: {
          limit: 1,
          keyPath: this.store.keyPath
        }
      });
    });
  }

  _subscribe(callback, _includeInitial) {
    const store = super.getSubscribeStore();
    const mingoQuery = this.createMingoQuery();
    const promise = _includeInitial ? this.fetch(({
      result,
      meta,
      info
    }) => {
      callback(null, [{
        type: 'initial',
        initial: result,
        queryInfo: info,
        meta
      }]);
    }) : Promise.resolve();
    const unsubscribe = store.subscribe(async action => {
      const changes = [];

      switch (action.type) {
        case 'inserted':
          {
            const filtered = action.next.filter(mingoQuery.test);

            if (filtered.length > 0) {
              changes.push({
                type: 'updated',
                result: this.transformer(filtered[0])
              });
            }

            break;
          }

        case 'deleted':
          {
            const filtered = action.prev.filter(mingoQuery.test);

            if (filtered.length > 0) {
              changes.push({
                type: 'deleted',
                keys: filtered.map(object => object[this.store.keyPath])
              });
            }

            break;
          }

        case 'updated':
          {
            const filtered = action.changes.filter(([prev, next]) => mingoQuery.test(prev));

            if (filtered.length > 0) {
              if (this.options.sort) {
                const {
                  result
                } = await this.fetch(res => res);
                changes.push({
                  type: 'updated',
                  result
                });
              } else if (filtered.length !== 1) {
                throw new Error('should not match more than 1, use sort if you can have multiple match');
              } else {
                const [, next] = filtered[0];
                changes.push({
                  type: 'updated',
                  result: mingoQuery.test(next) ? this.transformer(next) : null
                });
              }
            } else if (filtered.length === 0) ;

            break;
          }

        default:
          throw new Error('Unsupported type');
      }

      if (changes.length === 0) return;
      callback(null, changes);
    });
    return {
      stop: unsubscribe,
      cancel: unsubscribe,
      then: (onFulfilled, onRejected) => promise.then(onFulfilled, onRejected)
    };
  }

  async createMongoCursor() {
    const cursor = await this.store.cursor(this.options.criteria, this.options.sort);

    if (this.options.limit) {
      await cursor.limit(this.options.limit);
    }

    return cursor;
  }

}

/* eslint-disable max-lines */
class MongoStore {
  constructor(connection, collectionName) {
    this.keyPath = '_id';
    this.connection = connection;

    if (!collectionName) {
      throw new Error(`Invalid collectionName: "${collectionName}"`);
    }

    this._collection = connection.getConnection().then(client => {
      this._collection = client.db().collection(collectionName);
      return this._collection;
    }, err => {
      this._collection = Promise.reject(err);
      return this._collection;
    });
  }

  get collection() {
    if (this.connection.connectionFailed) {
      return Promise.reject(new Error('MongoDB connection failed'));
    }

    return Promise.resolve(this._collection);
  }

  createQuerySingleItem(options, transformer) {
    return new MongoQuerySingleItem(this, options, transformer);
  }

  createQueryCollection(options, transformer) {
    return new MongoQueryCollection(this, options, transformer);
  }

  async insertOne(object) {
    if (!object._id) {
      object._id = new mongodb__default.ObjectID().toString();
    }

    if (!object.created) object.created = new Date();
    if (!object.updated) object.updated = new Date();
    const collection = await this.collection;
    const {
      result
    } = await collection.insertOne(object);

    if (!result.ok || result.n !== 1) {
      throw new Error('Fail to insert');
    }

    return object;
  }

  async replaceOne(object) {
    if (!object.updated) object.updated = new Date();
    const collection = await this.collection;
    await collection.replaceOne({
      _id: object._id
    }, object);
    return object;
  }

  async upsertOne(object, setOnInsertPartialObject) {
    const result = await this.upsertOneWithInfo(object, setOnInsertPartialObject);
    return result.object;
  }

  async upsertOneWithInfo(object, setOnInsertPartialObject) {
    const $setOnInsert = {
      created: object.created || new Date(),
      ...setOnInsertPartialObject
    };

    if (!object.updated) {
      object.updated = new Date();
    }

    const $set = { ...object
    };
    delete $set.created;
    const collection = await this.collection;
    const {
      upsertedCount
    } = await collection.updateOne({
      _id: object._id
    }, {
      $set,
      $setOnInsert
    }, {
      upsert: true
    });

    if (upsertedCount) {
      Object.assign(object, $setOnInsert);
    }

    return {
      object: object,
      inserted: !!upsertedCount
    };
  }

  replaceSeveral(objects) {
    return Promise.all(objects.map(object => this.replaceOne(object)));
  }

  async partialUpdateByKey(key, partialUpdate, criteria) {
    const collection = await this.collection;
    const commandResult = await collection.updateOne({
      _id: key,
      ...criteria
    }, partialUpdate);

    if (!commandResult.result.ok) {
      console.error(commandResult);
      throw new Error('Update failed');
    }

    const object = await this.findByKey(key);
    return object;
  }

  partialUpdateOne(object, partialUpdate) {
    return this.partialUpdateByKey(object._id, partialUpdate);
  }

  partialUpdateMany(criteria, partialUpdate) {
    return this.collection.then(collection => collection.updateMany(criteria, partialUpdate)).then(() => undefined); // TODO return updated object
  }

  deleteByKey(key, criteria) {
    return this.collection.then(collection => collection.deleteOne({
      _id: key,
      ...criteria
    })).then(() => undefined);
  }

  deleteOne(object) {
    return this.deleteByKey(object._id);
  }

  deleteMany(selector) {
    return this.collection.then(collection => collection.deleteMany(selector)).then(() => undefined);
  }

  cursor(criteria, sort) {
    return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => new MongoCursor(this, cursor));
  }

  findByKey(key, criteria) {
    return this.collection.then(collection => collection.findOne({
      _id: key,
      ...criteria
    })).then(result => result || undefined);
  }

  findAll(criteria, sort) {
    return this.cursor(criteria, sort).then(cursor => cursor.toArray());
  }

  findOne(criteria, sort) {
    return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => cursor.limit(1).next());
  }

}

const logger = new Logger__default('liwi:mongo:MongoConnection');
class MongoConnection extends liwiStore.AbstractConnection {
  // TODO interface
  constructor(config) {
    super();

    if (!config.has('host')) {
      config.set('host', 'localhost');
    }

    if (!config.has('port')) {
      config.set('port', '27017');
    }

    if (!config.has('database')) {
      throw new Error('Missing config database');
    }

    const connectionString = `mongodb://${config.has('user') ? `${config.get('user')}:${config.get('password')}@` : ''}` + `${config.get('host')}:${config.get('port')}/${config.get('database')}`;
    this.connect(connectionString);
  }

  connect(connectionString) {
    logger.info('connecting', {
      connectionString
    });
    const connectPromise = mongodb__default.MongoClient.connect(connectionString, {
      useNewUrlParser: true
    }).then(connection => {
      logger.info('connected', {
        connectionString
      });
      connection.on('close', () => {
        logger.warn('close', {
          connectionString
        });
        this.connectionFailed = true;

        this.getConnection = () => {
          throw new Error('MongoDB connection closed');
        };
      });
      connection.on('timeout', () => {
        logger.warn('timeout', {
          connectionString
        });
        this.connectionFailed = true;

        this.getConnection = () => {
          throw new Error('MongoDB connection timeout');
        };
      });
      connection.on('reconnect', () => {
        logger.warn('reconnect', {
          connectionString
        });
        this.connectionFailed = false;

        this.getConnection = () => Promise.resolve(this._connection);
      });
      connection.on('error', err => {
        logger.warn('error', {
          connectionString,
          err
        });
      });
      this._connection = connection;
      this._connecting = undefined;

      this.getConnection = () => Promise.resolve(this._connection);

      return connection;
    }).catch(err => {
      logger.info('not connected', {
        connectionString
      });
      console.error(err.message || err); // throw err;

      process.nextTick(() => {
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1);
      });
      throw err;
    });

    this.getConnection = () => Promise.resolve(connectPromise);

    this._connecting = this.getConnection();
  }

  getConnection() {
    throw new Error('call connect()');
  }

  async close() {
    this.getConnection = () => Promise.reject(new Error('Connection closed'));

    if (this._connection) {
      await this._connection.close();
      this._connection = undefined;
    } else if (this._connecting) {
      await this._connecting;
      await this.close();
    }
  }

}

function createMongoSubscribeStore(mongoStore) {
  return new liwiSubscribeStore.SubscribeStore(mongoStore);
}

exports.MongoConnection = MongoConnection;
exports.MongoStore = MongoStore;
exports.createMongoSubscribeStore = createMongoSubscribeStore;
//# sourceMappingURL=index-node12-dev.cjs.js.map
