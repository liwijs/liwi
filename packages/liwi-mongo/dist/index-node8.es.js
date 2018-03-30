import { AbstractCursor, AbstractStore, AbstractConnection } from 'liwi-store';
import { ObjectID, MongoClient } from 'mongodb';
import Logger from 'nightingale-logger';

let MongoCursor = class extends AbstractCursor {
  constructor(store, cursor) {
    super(store);
    this._cursor = cursor;
  }

  advance(count) {
    this._cursor.skip(count);
  }

  next() {
    return this._cursor.next().then(value => {
      this._result = value;
      this.key = value && value._id;
      return this.key;
    });
  }

  limit(newLimit) {
    this._cursor.limit(newLimit);
    return Promise.resolve(this);
  }

  count(applyLimit = false) {
    return this._cursor.count(applyLimit);
  }

  result() {
    return Promise.resolve(this._result);
  }

  close() {
    if (this._cursor) {
      this._cursor.close();
      this._cursor = undefined;
      this._store = undefined;
      this._result = undefined;
    }

    return Promise.resolve();
  }

  toArray() {
    return this._cursor.toArray();
  }
};

let MongoStore = class extends AbstractStore {

  constructor(connection, collectionName) {
    super(connection);

    this.keyPath = '_id';
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
    if (this.connection.connectionFailed) {
      return Promise.reject(new Error('MongoDB connection failed'));
    }

    return Promise.resolve(this._collection);
  }

  create() {
    return Promise.resolve();
  }

  insertOne(object) {
    if (!object._id) {
      object._id = new ObjectID().toString();
    }
    if (!object.created) {
      object.created = new Date();
    }

    return this.collection.then(collection => collection.insertOne(object)).then(({ result, connection, ops }) => {
      if (!result.ok || result.n !== 1) {
        throw new Error('Fail to insert');
      }
    }).then(() => object);
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object) {
    if (!object.updated) {
      object.updated = new Date();
    }

    return this.collection.then(collection => collection.updateOne({ _id: object._id }, object)).then(() => object);
  }

  upsertOne(object) {
    if (!object.updated) {
      object.updated = new Date();
    }

    return this.collection.then(collection => collection.updateOne({ _id: object._id }, { $set: object }, { upsert: true })).then(() => object);
  }

  replaceSeveral(objects) {
    return Promise.all(objects.map(object => this.updateOne(object)));
  }

  _partialUpdate(partialUpdate) {
    // https://docs.mongodb.com/manual/reference/operator/update/
    // if has a mongo operator
    if (Object.keys(partialUpdate).some(key => key[0] === '$')) {
      return partialUpdate;
    } else {
      return { $set: partialUpdate };
    }
  }

  async partialUpdateByKey(key, partialUpdate) {
    partialUpdate = this._partialUpdate(partialUpdate);
    const collection = await this.collection;
    const commandResult = await collection.updateOne({ _id: key }, partialUpdate);
    if (!commandResult.result.ok) {
      console.error(commandResult);
      throw new Error('Update failed');
    }
    return this.findByKey(key);
  }

  partialUpdateOne(object, partialUpdate) {
    partialUpdate = this._partialUpdate(partialUpdate);
    return this.partialUpdateByKey(object._id, partialUpdate);
  }

  partialUpdateMany(criteria, partialUpdate) {
    partialUpdate = this._partialUpdate(partialUpdate);
    return this.collection.then(collection => collection.updateMany(criteria, partialUpdate)).then(() => undefined); // TODO return updated object
  }

  deleteByKey(key) {
    return this.collection.then(collection => collection.removeOne({ _id: key })).then(() => undefined);
  }

  cursor(criteria, sort) {
    return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => new MongoCursor(this, cursor));
  }

  findByKey(key) {
    return this.findOne({ _id: key });
  }

  findOne(criteria, sort) {
    return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => cursor.limit(1).next());
  }
};

const logger = new Logger('liwi:mongo:MongoConnection');

let MongoConnection = class extends AbstractConnection {

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
    logger.info('connecting', { connectionString });

    const connectPromise = MongoClient.connect(connectionString).then(connection => {
      logger.info('connected', { connectionString });
      connection.on('close', () => {
        logger.warn('close', { connectionString });
        this.connectionFailed = true;
        this.getConnection = () => Promise.reject(new Error('MongoDB connection closed'));
      });
      connection.on('timeout', () => {
        logger.warn('timeout', { connectionString });
        this.connectionFailed = true;
        this.getConnection = () => Promise.reject(new Error('MongoDB connection timeout'));
      });
      connection.on('reconnect', () => {
        logger.warn('reconnect', { connectionString });
        this.connectionFailed = false;
        this.getConnection = () => Promise.resolve(this._connection);
      });
      connection.on('error', err => {
        logger.warn('error', { connectionString, err });
      });

      this._connection = connection;
      this._connecting = null;
      this.getConnection = () => Promise.resolve(this._connection);
      return connection;
    }).catch(err => {
      logger.info('not connected', { connectionString });
      console.error(err.message || err);
      // throw err;
      process.nextTick(() => {
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

  close() {
    this.getConnection = () => Promise.reject(new Error('Connection closed'));
    if (this._connection) {
      return this._connection.close().then(() => {
        this._connection = null;
      });
    } else if (this._connecting) {
      return this._connecting.then(() => this.close());
    }
  }
};

export default MongoStore;
export { MongoStore, MongoConnection };
//# sourceMappingURL=index-node8.es.js.map
