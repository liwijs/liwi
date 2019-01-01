import { ObjectID, MongoClient } from 'mongodb';
import { AbstractCursor, AbstractStore, AbstractConnection } from 'liwi-store';
import mingo from 'mingo';
import { AbstractSubscribeQuery } from 'liwi-subscribe-store';
import Logger from 'nightingale-logger';

class MongoCursor extends AbstractCursor {
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
      this.key = value && value._id;
      return this.key;
    });
  }

  limit(newLimit) {
    this.cursor.limit(newLimit);
    return Promise.resolve(this);
  }

  count(applyLimit = false) {
    return this.cursor.count(applyLimit);
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

class MongoQuery extends AbstractSubscribeQuery {
  constructor(store, criteria, sort) {
    super(store);
    this.criteria = criteria;
    this.sort = sort;
  }

  getMingoQuery() {
    if (!this.mingoQuery) {
      this.mingoQuery = new mingo.Query(this.criteria);
    }

    return this.mingoQuery;
  }

  fetch(onFulfilled) {
    return super.store.findAll(this.criteria, this.sort).then(onFulfilled);
  }

  _subscribe(callback, _includeInitial) {
    const store = super.getSubscribeStore();
    const mingoQuery = this.getMingoQuery();

    const promise = _includeInitial && this.fetch(result => {
      callback(null, [{
        type: 'initial',
        initial: result
      }]);
      return result;
    });

    const unsubscribe = store.subscribe(action => {
      const filtered = (action.type === 'inserted' ? action.next : action.prev).filter(object => mingoQuery.test(object));
      const changes = [];

      switch (action.type) {
        case 'inserted':
          changes.push({
            type: 'inserted',
            objects: filtered
          });
          break;

        case 'deleted':
          changes.push({
            type: 'deleted',
            keys: filtered.map(object => object[super.store.keyPath])
          });
          break;

        case 'updated':
          {
            const {
              deleted,
              updated
            } = filtered.reduce((acc, object, index) => {
              const nextObject = action.next[index];

              if (!mingoQuery.test(nextObject)) {
                acc.deleted.push(object[super.store.keyPath]);
              } else {
                acc.updated.push(nextObject);
              }

              return acc;
            }, {
              deleted: [],
              updated: []
            });

            if (deleted.length !== 0) {
              changes.push({
                type: 'deleted',
                keys: deleted
              });
            }

            if (updated.length !== 0) {
              changes.push({
                type: 'updated',
                objects: updated
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
      then: _includeInitial ? onFulfilled => promise.then(onFulfilled) : () => Promise.resolve()
    };
  }

}

class MongoStore extends AbstractStore {
  constructor(connection, collectionName) {
    super(connection, '_id');

    if (!collectionName) {
      throw new Error(`Invalid collectionName: "${collectionName}"`);
    }

    this._collection = connection.getConnection().then(db => {
      this._collection = db.collection(collectionName);
      return this._collection;
    }, err => {
      this._collection = Promise.reject(err);
      return this._collection;
    });
  }

  get collection() {
    if (super.connection.connectionFailed) {
      return Promise.reject(new Error('MongoDB connection failed'));
    }

    return Promise.resolve(this._collection);
  }

  createQuery(criteria) {
    return new MongoQuery(this, criteria);
  }

  async insertOne(object) {
    if (!object._id) {
      object._id = new ObjectID().toString();
    }

    object.created = new Date();
    object.updated = new Date();
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
    object.updated = new Date();
    const collection = await this.collection;
    await collection.updateOne({
      _id: object._id
    }, object);
    return object;
  }

  async upsertOneWithInfo(object) {
    const $setOnInsert = {
      created: new Date()
    };
    object.updated = new Date();
    const $set = Object.assign({}, object);
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
      object.created = $setOnInsert.created;
    }

    return {
      object: object,
      inserted: !!upsertedCount
    };
  }

  replaceSeveral(objects) {
    return Promise.all(objects.map(object => this.replaceOne(object)));
  }

  async partialUpdateByKey(key, partialUpdate) {
    const collection = await this.collection;
    const commandResult = await collection.updateOne({
      _id: key
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

  deleteByKey(key) {
    return this.collection.then(collection => collection.deleteOne({
      _id: key
    })).then(() => undefined);
  }

  deleteMany(selector) {
    return this.collection.then(collection => collection.deleteMany(selector)).then(() => undefined);
  }

  cursor(criteria, sort) {
    return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => new MongoCursor(this, cursor));
  }

  findByKey(key) {
    return this.collection.then(collection => collection.findOne({
      _id: key
    }));
  }

  findOne(criteria, sort) {
    return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => cursor.limit(1).next());
  }

}

const logger = new Logger('liwi:mongo:MongoConnection');
class MongoConnection extends AbstractConnection {
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
    const connectPromise = MongoClient.connect(connectionString).then(connection => {
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

/* eslint-disable typescript/no-use-before-define */

export { MongoStore, MongoConnection };
//# sourceMappingURL=index-node10-dev.es.js.map