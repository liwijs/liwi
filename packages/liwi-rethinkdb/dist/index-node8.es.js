import { AbstractQuery, AbstractStore, AbstractConnection } from 'liwi-store';
import Logger from 'nightingale-logger';
import rethinkDB from 'rethinkdbdash';

let Query = class extends AbstractQuery {
  fetch(callback) {
    return this.queryCallback(this.store.query(), this.store.r).run().then(callback);
  }

  _subscribe(callback, _includeInitial = false, args) {
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

    return {
      stop,
      cancel: stop,
      then: (cb, errCb) => promise.then(cb, errCb)
    };
  }

  closeFeed(feed, promise) {
    if (feed) {
      feed.close();
    } else if (promise) {
      promise.then(feed => feed.close());
    }
  }
};

// import RethinkCursor from './RethinkCursor';

let RethinkStore = class extends AbstractStore {

  constructor(connection, tableName) {
    super(connection);
    this.keyPath = 'id';
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
    return this.r.tableCreate(this._tableName).then(() => null);
  }

  insertOne(object) {
    if (!object.created) object.created = new Date();

    return this.table().insert(object).then(({ inserted, generated_keys: generatedKeys }) => {
      if (inserted !== 1) throw new Error('Could not insert');
      if (object.id == null) {
        // eslint-disable-next-line prefer-destructuring
        object.id = generatedKeys[0];
      }
    }).then(() => object);
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object) {
    if (!object.created) object.created = new Date();
    if (!object.updated) object.updated = new Date();

    return this.table().get(object.id).replace(object).then(() => object);
  }

  upsertOne(object) {
    if (!object.updated) object.updated = new Date();

    return this.table().insert(object, { conflict: 'replace' }).run().then(() => object);
  }

  replaceSeveral(objects) {
    return Promise.all(objects.map(object => this.replaceOne(object)));
  }

  partialUpdateByKey(key, partialUpdate) {
    return this.table().get(key).update(partialUpdate).run();
  }

  partialUpdateOne(object, partialUpdate) {
    return this.table().get(object.id).update(partialUpdate, { returnChanges: true }).then(res => res.changes[0].new_val);
  }

  partialUpdateMany(criteria, partialUpdate) {
    return this.table().filter(criteria).update(partialUpdate).run();
  }

  deleteByKey(key) {
    return this.table().get(key).delete().run();
  }

  cursor(query, sort) {
    // : Promise<RethinkCursor<ModelType>> {
    if (sort) throw new Error('sort is not supported');
    throw new Error('Not Supported yet, please use query().run({ cursor: true })');
  }

  findAll() {
    throw new Error('Not supported, please use query().run()');
  }

  findByKey(key) {
    return this.table().get(key).run();
  }

  findOne(query) {
    return query.run({ cursor: true }).then(cursor => cursor.next().catch(() => null));
  }

  findValue(field, query) {
    return query.getField(field).run({ cursor: true }).then(cursor => cursor.next().catch(() => null));
  }
};

const logger = new Logger('liwi:rethinkdb:RethinkConnection');

let RethinkConnection = class extends AbstractConnection {

  constructor(config) {
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

export { RethinkStore, RethinkConnection };
//# sourceMappingURL=index-node8.es.js.map
