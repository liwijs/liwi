'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Logger = _interopDefault(require('nightingale-logger'));
var rethinkDB = _interopDefault(require('rethinkdbdash'));
var liwiStore = require('liwi-store');
var t = _interopDefault(require('flow-runtime'));

const logger = new Logger('liwi:rethinkdb:RethinkConnection');

let RethinkConnection = class extends liwiStore.AbstractConnection {

  constructor(config) {
    let _configType = t.ref('Map', t.string(), t.union(t.string(), t.number()));

    t.param('config', _configType).assert(config);

    super();

    if (!config.has('host')) {
      config.set('host', 'localhost');
    }
    if (!config.has('port')) {
      config.set('port', '28015');
    }
    if (!config.has('database')) {
      throw new Error('Missing config database');
    }

    this.connect({
      host: config.get('host'),
      port: config.get('port'),
      db: config.get('database')
    });
  }

  connect(options) {
    let _optionsType = t.object();

    t.param('options', _optionsType).assert(options);

    logger.info('connecting', options);

    this._connection = rethinkDB(Object.assign({}, options, {
      buffer: 20,
      max: 100
    }));

    this._connection.getPoolMaster().on('healthy', healthy => {
      if (healthy === true) {
        this.getConnection = () => Promise.resolve(this._connection);
        logger.info('healthy');
      } else {
        this.getConnection = () => Promise.reject(new Error('Connection not healthy'));
        logger.warn('not healthy');
      }
    });

    this.getConnection = () => Promise.resolve(this._connection);
  }

  getConnection() {
    t.return(t.void());

    throw new Error('call connect()');
  }

  close() {
    this.getConnection = () => Promise.reject(new Error('Connection closed'));
    if (this._connection) {
      return this._connection.getPoolMaster().drain().then(() => {
        logger.info('connection closed');
        this._connection = null;
      });
    } else if (this._connecting) {
      return this.getConnection().then(() => this.close());
    }
  }
};

const SubscribeReturnType = t.type('SubscribeReturnType', t.object(t.property('cancel', t.function(t.return(t.void()))), t.property('stop', t.function(t.return(t.void())))));
let Query = class extends liwiStore.AbstractQuery {
  constructor(...args) {
    super(...args);
    t.bindTypeParameters(this, t.ref(RethinkStore));
  }

  fetch(callback) {
    let _callbackType = t.nullable(t.function());

    const _returnType = t.return(t.any());

    t.param('callback', _callbackType).assert(callback);

    return this.queryCallback(this.store.query(), this.store.r).run().then(callback).then(_arg => _returnType.assert(_arg));
  }

  _subscribe(callback, _includeInitial = false, args) {
    let _callbackType2 = t.function();

    let _argsType = t.array(t.any());

    const _returnType2 = t.return(SubscribeReturnType);

    t.param('callback', _callbackType2).assert(callback);
    t.param('args', _argsType).assert(args);

    let _feed;
    const promise = this.queryCallback(this.store.query(), this.store.r).changes({
      includeInitial: _includeInitial,
      includeStates: true,
      includeTypes: true,
      includeOffsets: true
    }).then(feed => {
      if (args.length === 0) {
        _feed = feed;
        delete this._promise;
      }

      feed.each(callback);
      return feed;
    });

    if (args.length === 0) this._promise = promise;

    const stop = () => {
      this.closeFeed(_feed, promise);
    };

    return _returnType2.assert({
      stop,
      cancel: stop,
      then: (cb, errCb) => promise.then(cb, errCb)
    });
  }

  closeFeed(feed, promise) {
    if (feed) {
      feed.close();
    } else if (promise) {
      promise.then(feed => feed.close());
    }
  }
};

const InsertType = t.tdz(() => liwiStore.InsertType);
const UpdateType = t.tdz(() => liwiStore.UpdateType);
const ResultType = t.tdz(() => liwiStore.ResultType);
let RethinkStore = class extends liwiStore.AbstractStore {

  constructor(connection, tableName) {
    let _connectionType = t.ref(RethinkConnection);

    let _tableNameType = t.string();

    t.param('connection', _connectionType).assert(connection);
    t.param('tableName', _tableNameType).assert(tableName);

    super(connection);
    this.keyPath = 'id';
    t.bindTypeParameters(this, t.ref(RethinkConnection));
    this._tableName = tableName;
    this.r = this.connection._connection;
  }

  table() {
    return this.r.table(this._tableName);
  }

  createQuery(query) {
    return new Query(this, query);
  }

  query() {
    return this.table();
  }

  _query(criteria, sort) {
    let _criteriaType = t.nullable(t.object());

    let _sortType = t.nullable(t.object());

    t.param('criteria', _criteriaType).assert(criteria);
    t.param('sort', _sortType).assert(sort);

    const query = this.table();

    if (criteria) {
      query.filter(criteria);
    }

    if (sort) {
      Object.keys(sort).forEach(key => {
        if (sort[key] === -1) {
          query.orderBy(this.r.desc(key));
        } else {
          query.orderBy(key);
        }
      });
    }

    return query;
  }

  create() {
    const _returnType = t.return(t.void());

    return this.r.tableCreate(this._tableName).then(() => null).then(_arg => _returnType.assert(_arg));
  }

  insertOne(object) {
    let _objectType = t.ref(InsertType);

    const _returnType2 = t.return(t.ref(ResultType));

    t.param('object', _objectType).assert(object);

    if (!object.created) object.created = new Date();

    return this.table().insert(object).then(({ inserted, generated_keys: generatedKeys }) => {
      if (inserted !== 1) throw new Error('Could not insert');
      if (object.id == null) {
        // eslint-disable-next-line prefer-destructuring
        object.id = generatedKeys[0];
      }
    }).then(() => object).then(_arg2 => _returnType2.assert(_arg2));
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object) {
    let _objectType2 = t.ref(InsertType);

    const _returnType3 = t.return(t.ref(ResultType));

    t.param('object', _objectType2).assert(object);

    if (!object.created) object.created = new Date();
    if (!object.updated) object.updated = new Date();

    return this.table().get(object.id).replace(object).then(() => object).then(_arg3 => _returnType3.assert(_arg3));
  }

  upsertOne(object) {
    let _objectType3 = t.ref(UpdateType);

    const _returnType4 = t.return(t.ref(ResultType));

    t.param('object', _objectType3).assert(object);

    if (!object.updated) object.updated = new Date();

    return this.table().insert(object, { conflict: 'replace' }).run().then(() => object).then(_arg4 => _returnType4.assert(_arg4));
  }

  replaceSeveral(objects) {
    let _objectsType = t.array(t.ref(InsertType));

    const _returnType5 = t.return(t.array(t.ref(ResultType)));

    t.param('objects', _objectsType).assert(objects);

    return Promise.all(objects.map(object => this.replaceOne(object))).then(_arg5 => _returnType5.assert(_arg5));
  }

  partialUpdateByKey(key, partialUpdate) {
    let _keyType = t.any();

    let _partialUpdateType = t.object();

    const _returnType6 = t.return(t.void());

    t.param('key', _keyType).assert(key);
    t.param('partialUpdate', _partialUpdateType).assert(partialUpdate);

    return this.table().get(key).update(partialUpdate).run().then(_arg6 => _returnType6.assert(_arg6));
  }

  partialUpdateOne(object, partialUpdate) {
    let _objectType4 = t.ref(ResultType);

    let _partialUpdateType2 = t.ref(UpdateType);

    const _returnType7 = t.return(t.ref(ResultType));

    t.param('object', _objectType4).assert(object);
    t.param('partialUpdate', _partialUpdateType2).assert(partialUpdate);

    return this.table().get(object.id).update(partialUpdate, { returnChanges: true }).then(res => res.changes[0].new_val).then(_arg7 => _returnType7.assert(_arg7));
  }

  partialUpdateMany(criteria, partialUpdate) {
    let _partialUpdateType3 = t.object();

    const _returnType8 = t.return(t.void());

    t.param('partialUpdate', _partialUpdateType3).assert(partialUpdate);

    return this.table().filter(criteria).update(partialUpdate).run().then(_arg8 => _returnType8.assert(_arg8));
  }

  deleteByKey(key) {
    let _keyType2 = t.any();

    const _returnType9 = t.return(t.void());

    t.param('key', _keyType2).assert(key);

    return this.table().get(key).delete().run().then(_arg9 => _returnType9.assert(_arg9));
  }

  cursor(query, sort) {
    let _sortType2 = t.nullable(t.object());

    t.param('sort', _sortType2).assert(sort);

    // : Promise<RethinkCursor<ModelType>> {
    if (sort) throw new Error('sort is not supported');
    throw new Error('Not Supported yet, please use query().run({ cursor: true })');
  }

  findAll() {
    t.return(t.void());

    throw new Error('Not supported, please use query().run()');
  }

  findByKey(key) {
    let _keyType3 = t.any();

    const _returnType11 = t.return(t.nullable(t.ref(ResultType)));

    t.param('key', _keyType3).assert(key);

    return this.table().get(key).run().then(_arg10 => _returnType11.assert(_arg10));
  }

  findOne(query) {
    const _returnType12 = t.return(t.nullable(t.ref(ResultType)));

    return query.run({ cursor: true }).then(cursor => cursor.next().catch(() => null)).then(_arg11 => _returnType12.assert(_arg11));
  }

  findValue(field, query) {
    let _fieldType = t.string();

    const _returnType13 = t.return(t.any());

    t.param('field', _fieldType).assert(field);

    return query.getField(field).run({ cursor: true }).then(cursor => cursor.next().catch(() => null)).then(_arg12 => _returnType13.assert(_arg12));
  }
};

exports.RethinkStore = RethinkStore;
exports.RethinkConnection = RethinkConnection;
//# sourceMappingURL=index-node8-dev.cjs.js.map
