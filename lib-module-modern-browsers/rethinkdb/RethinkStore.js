
import AbstractStore from '../store/AbstractStore';
import Query from './Query';
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
    var _this = this;

    const query = this.table();

    if (criteria) {
      query.filter(criteria);
    }

    if (sort) {
      Object.keys(sort).forEach(function (key) {
        if (sort[key] === -1) {
          query.orderBy(_this.r.desc(key));
        } else {
          query.orderBy(key);
        }
      });
    }

    return query;
  }

  create() {
    return this.r.tableCreate(this._tableName).then(function () {
      return null;
    });
  }

  insertOne(object) {
    if (!object.created) object.created = new Date();

    return this.table().insert(object).then(function ({ inserted, generated_keys: generatedKeys }) {
      if (inserted !== 1) throw new Error('Could not insert');
      if (object.id == null) {
        // eslint-disable-next-line prefer-destructuring
        object.id = generatedKeys[0];
      }
    }).then(function () {
      return object;
    });
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object) {
    if (!object.created) object.created = new Date();
    if (!object.updated) object.updated = new Date();

    return this.table().get(object.id).replace(object).then(function () {
      return object;
    });
  }

  upsertOne(object) {
    if (!object.updated) object.updated = new Date();

    return this.table().insert(object, { conflict: 'replace' }).run().then(function () {
      return object;
    });
  }

  replaceSeveral(objects) {
    var _this2 = this;

    return Promise.all(objects.map(function (object) {
      return _this2.replaceOne(object);
    }));
  }

  partialUpdateByKey(key, partialUpdate) {
    return this.table().get(key).update(partialUpdate).run();
  }

  partialUpdateOne(object, partialUpdate) {
    return this.table().get(object.id).update(partialUpdate, { returnChanges: true }).then(function (res) {
      return res.changes[0].new_val;
    });
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
    return query.run({ cursor: true }).then(function (cursor) {
      return cursor.next().catch(function () {
        return null;
      });
    });
  }

  findValue(field, query) {
    return query.getField(field).run({ cursor: true }).then(function (cursor) {
      return cursor.next().catch(function () {
        return null;
      });
    });
  }
};
export { RethinkStore as default };
//# sourceMappingURL=RethinkStore.js.map