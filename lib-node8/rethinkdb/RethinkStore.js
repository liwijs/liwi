'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _AbstractStore = require('../store/AbstractStore');

var _AbstractStore2 = _interopRequireDefault(_AbstractStore);

var _Query = require('./Query');

var _Query2 = _interopRequireDefault(_Query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import RethinkCursor from './RethinkCursor';
let RethinkStore = class extends _AbstractStore2.default {

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
    return new _Query2.default(this, query);
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
    return this.table().get(object.id).update(partialUpdate, { returnChanges: true }).then(res => res.changes.new_val);
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
exports.default = RethinkStore;
//# sourceMappingURL=RethinkStore.js.map