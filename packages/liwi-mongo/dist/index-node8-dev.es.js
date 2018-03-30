import Logger from 'nightingale-logger';
import { MongoClient, ObjectID } from 'mongodb';
import Db from 'mongodb/lib/db';
import { AbstractConnection, AbstractCursor, ResultType, AbstractStore, InsertType, UpdateType } from 'liwi-store';
import t from 'flow-runtime';
import Cursor from 'mongodb/lib/cursor';
import Collection from 'mongodb/lib/collection';

const logger = new Logger('liwi:mongo:MongoConnection');

let MongoConnection = class extends AbstractConnection {

  constructor(config) {
    let _configType = t.ref('Map', t.string(), t.union(t.string(), t.number()));

    t.param('config', _configType).assert(config);

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
    t.return(t.ref(Db));

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

const ResultType$1 = t.tdz(() => ResultType);
let MongoCursor = class extends AbstractCursor {
  constructor(store, cursor) {
    let _storeType = t.ref(MongoStore);

    let _cursorType = t.ref(Cursor);

    t.param('store', _storeType).assert(store);
    t.param('cursor', _cursorType).assert(cursor);

    super(store);
    t.bindTypeParameters(this, t.ref(MongoStore));
    this._cursor = cursor;
  }

  advance(count) {
    let _countType = t.number();

    t.return(t.void());
    t.param('count', _countType).assert(count);

    this._cursor.skip(count);
  }

  next() {
    const _returnType2 = t.return(t.any());

    return this._cursor.next().then(value => {
      this._result = value;
      this.key = value && value._id;
      return this.key;
    }).then(_arg => _returnType2.assert(_arg));
  }

  limit(newLimit) {
    let _newLimitType = t.number();

    const _returnType3 = t.return(t.ref('Promise'));

    t.param('newLimit', _newLimitType).assert(newLimit);

    this._cursor.limit(newLimit);
    return _returnType3.assert(Promise.resolve(this));
  }

  count(applyLimit = false) {
    let _applyLimitType = t.boolean();

    t.param('applyLimit', _applyLimitType).assert(applyLimit);

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
    const _returnType4 = t.return(t.array(t.ref(ResultType$1)));

    return this._cursor.toArray().then(_arg2 => _returnType4.assert(_arg2));
  }
};

const InsertType$1 = t.tdz(() => InsertType);
const UpdateType$1 = t.tdz(() => UpdateType);
const ResultType$2 = t.tdz(() => ResultType);
const MongoUpdateCommandResultType = t.type('MongoUpdateCommandResultType', t.object(t.property('connection', t.any()), t.property('matchedCount', t.number()), t.property('modifiedCount', t.number()), t.property('result', t.exactObject(t.property('n', t.number()), t.property('nModified', t.number()), t.property('ok', t.number()))), t.property('upsertedCount', t.number()), t.property('upsertedId', t.null())));
let MongoStore = class extends AbstractStore {

  constructor(connection, collectionName) {
    let _connectionType = t.ref(MongoConnection);

    let _collectionNameType = t.string();

    t.param('connection', _connectionType).assert(connection);
    t.param('collectionName', _collectionNameType).assert(collectionName);

    super(connection);

    this.keyPath = '_id';
    t.bindTypeParameters(this, t.ref(MongoConnection));
    if (!collectionName) {
      throw new Error(`Invalid collectionName: "${collectionName}"`);
    }

    this._collection = connection.getConnection().then(db => {
      let _dbType = t.ref(Db);

      t.param('db', _dbType).assert(db);

      this._collection = db.collection(collectionName);
      return this._collection;
    }, err => {
      let _errType = t.any();

      t.param('err', _errType).assert(err);

      this._collection = Promise.reject(err);
      return this._collection;
    });
  }

  get collection() {
    const _returnType2 = t.return(t.ref(Collection));

    if (this.connection.connectionFailed) {
      return Promise.reject(new Error('MongoDB connection failed')).then(_arg => _returnType2.assert(_arg));
    }

    return Promise.resolve(this._collection).then(_arg2 => _returnType2.assert(_arg2));
  }

  create() {
    const _returnType3 = t.return(t.ref('Promise'));

    return _returnType3.assert(Promise.resolve());
  }

  insertOne(object) {
    let _objectType = t.ref(InsertType$1);

    const _returnType4 = t.return(t.ref(ResultType$2));

    t.param('object', _objectType).assert(object);

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
    }).then(() => object).then(_arg3 => _returnType4.assert(_arg3));
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object) {
    let _objectType2 = t.ref(InsertType$1);

    const _returnType5 = t.return(t.ref(ResultType$2));

    t.param('object', _objectType2).assert(object);

    if (!object.updated) {
      object.updated = new Date();
    }

    return this.collection.then(collection => collection.updateOne({ _id: object._id }, object)).then(() => object).then(_arg4 => _returnType5.assert(_arg4));
  }

  upsertOne(object) {
    let _objectType3 = t.ref(InsertType$1);

    const _returnType6 = t.return(t.ref(ResultType$2));

    t.param('object', _objectType3).assert(object);

    if (!object.updated) {
      object.updated = new Date();
    }

    return this.collection.then(collection => collection.updateOne({ _id: object._id }, { $set: object }, { upsert: true })).then(() => object).then(_arg5 => _returnType6.assert(_arg5));
  }

  replaceSeveral(objects) {
    let _objectsType = t.array(t.ref(InsertType$1));

    const _returnType7 = t.return(t.array(t.ref(ResultType$2)));

    t.param('objects', _objectsType).assert(objects);

    return Promise.all(objects.map(object => this.updateOne(object))).then(_arg6 => _returnType7.assert(_arg6));
  }

  _partialUpdate(partialUpdate) {
    let _partialUpdateType = t.object();

    t.param('partialUpdate', _partialUpdateType).assert(partialUpdate);

    // https://docs.mongodb.com/manual/reference/operator/update/
    // if has a mongo operator
    if (Object.keys(partialUpdate).some(key => key[0] === '$')) {
      return partialUpdate;
    } else {
      return { $set: partialUpdate };
    }
  }

  async partialUpdateByKey(key, partialUpdate) {
    let _keyType = t.any();

    let _partialUpdateType2 = t.ref(UpdateType$1);

    const _returnType = t.return(t.union(t.ref(ResultType$2), t.ref('Promise', t.ref(ResultType$2))));

    t.param('key', _keyType).assert(key);
    t.param('partialUpdate', _partialUpdateType2).assert(partialUpdate);

    partialUpdate = _partialUpdateType2.assert(this._partialUpdate(partialUpdate));
    const collection = await this.collection;
    const commandResult = MongoUpdateCommandResultType.assert((await collection.updateOne({ _id: key }, partialUpdate)));
    if (!commandResult.result.ok) {
      console.error(commandResult);
      throw new Error('Update failed');
    }
    return _returnType.assert(this.findByKey(key));
  }

  partialUpdateOne(object, partialUpdate) {
    let _objectType4 = t.ref(ResultType$2);

    let _partialUpdateType3 = t.ref(UpdateType$1);

    const _returnType8 = t.return(t.ref(ResultType$2));

    t.param('object', _objectType4).assert(object);
    t.param('partialUpdate', _partialUpdateType3).assert(partialUpdate);

    partialUpdate = _partialUpdateType3.assert(this._partialUpdate(partialUpdate));
    return this.partialUpdateByKey(object._id, partialUpdate).then(_arg7 => _returnType8.assert(_arg7));
  }

  partialUpdateMany(criteria, partialUpdate) {
    let _partialUpdateType4 = t.ref(UpdateType$1);

    const _returnType9 = t.return(t.void());

    t.param('partialUpdate', _partialUpdateType4).assert(partialUpdate);

    partialUpdate = _partialUpdateType4.assert(this._partialUpdate(partialUpdate));
    return this.collection.then(collection => collection.updateMany(criteria, partialUpdate)).then(() => undefined).then(_arg8 => _returnType9.assert(_arg8)); // TODO return updated object
  }

  deleteByKey(key) {
    let _keyType2 = t.any();

    const _returnType10 = t.return(t.void());

    t.param('key', _keyType2).assert(key);

    return this.collection.then(collection => collection.removeOne({ _id: key })).then(() => undefined).then(_arg9 => _returnType10.assert(_arg9));
  }

  cursor(criteria, sort) {
    let _criteriaType = t.nullable(t.object());

    let _sortType = t.nullable(t.object());

    const _returnType11 = t.return(t.ref(MongoCursor, t.ref(ResultType$2)));

    t.param('criteria', _criteriaType).assert(criteria);
    t.param('sort', _sortType).assert(sort);

    return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => new MongoCursor(this, cursor)).then(_arg10 => _returnType11.assert(_arg10));
  }

  findByKey(key) {
    let _keyType3 = t.any();

    const _returnType12 = t.return(t.nullable(t.ref(ResultType$2)));

    t.param('key', _keyType3).assert(key);

    return this.findOne({ _id: key }).then(_arg11 => _returnType12.assert(_arg11));
  }

  findOne(criteria, sort) {
    let _criteriaType2 = t.object();

    let _sortType2 = t.nullable(t.object());

    const _returnType13 = t.return(t.nullable(t.ref(ResultType$2)));

    t.param('criteria', _criteriaType2).assert(criteria);
    t.param('sort', _sortType2).assert(sort);

    return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => cursor.limit(1).next()).then(_arg12 => _returnType13.assert(_arg12));
  }
};

export default MongoStore;
export { MongoStore, MongoConnection };
//# sourceMappingURL=index-node8-dev.es.js.map
