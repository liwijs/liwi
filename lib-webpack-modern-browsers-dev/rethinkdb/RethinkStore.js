import _t from 'tcomb-forked';
import RethinkConnection from './RethinkConnection';
import AbstractStore from '../store/AbstractStore';
import Query from './Query';
// import RethinkCursor from './RethinkCursor';

export default class RethinkStore extends AbstractStore {

  constructor(connection, tableName) {
    _assert(connection, RethinkConnection, 'connection');

    _assert(tableName, _t.String, 'tableName');

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

    _assert(criteria, _t.maybe(_t.Object), 'criteria');

    _assert(sort, _t.maybe(_t.Object), 'sort');

    var query = this.table();

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
    return _assert(function () {
      return this.r.tableCreate(this._tableName);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  insertOne(object) {
    _assert(object, _t.Any, 'object');

    return _assert(function () {
      if (!object.created) {
        object.created = new Date();
      }

      return this.table().insert(object).then(function ({ inserted, generated_keys: generatedKeys }) {
        if (inserted !== 1) throw new Error('Could not insert');
        if (object.id == null) {
          object.id = generatedKeys[0];
        }
      }).then(function () {
        return object;
      });
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object) {
    _assert(object, _t.Any, 'object');

    return _assert(function () {
      if (!object.updated) {
        object.updated = new Date();
      }

      return this.table().get(object.id).replace(object).then(function () {
        return object;
      });
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  upsertOne(object) {
    _assert(object, _t.Any, 'object');

    return _assert(function () {
      if (!object.updated) {
        object.updated = new Date();
      }

      return this.table().insert(object, { conflict: 'replace' }).run().then(function () {
        return object;
      });
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  replaceSeveral(objects) {
    _assert(objects, _t.list(_t.Any), 'objects');

    return _assert(function () {
      var _this2 = this;

      return Promise.all(objects.map(function (object) {
        return _this2.replaceOne(object);
      }));
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  partialUpdateByKey(key, partialUpdate) {
    _assert(key, _t.Any, 'key');

    _assert(partialUpdate, _t.Object, 'partialUpdate');

    return _assert(function () {
      return this.table().get(key).update(partialUpdate).run();
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  partialUpdateOne(object, partialUpdate) {
    _assert(object, _t.Any, 'object');

    _assert(partialUpdate, _t.Object, 'partialUpdate');

    return _assert(function () {
      return this.table().get(object.id).update(partialUpdate, { returnChanges: true }).then(function (res) {
        return res.changes.new_val;
      });
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  partialUpdateMany(criteria, partialUpdate) {
    _assert(partialUpdate, _t.Object, 'partialUpdate');

    return _assert(function () {
      return this.table().filter(criteria).update(partialUpdate).run();
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  deleteByKey(key) {
    _assert(key, _t.Any, 'key');

    return _assert(function () {
      return this.table().get(key).delete().run();
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  cursor(query, sort) {
    _assert(sort, _t.maybe(_t.Object), 'sort');

    // : Promise<RethinkCursor<ModelType>> {
    if (sort) throw new Error('sort is not supported');
    throw new Error('Not Supported yet, please use query().run({ cursor: true })');
  }

  findAll() {
    return _assert(function () {
      throw new Error('Not supported, please use query().run()');
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  findByKey(key) {
    _assert(key, _t.Any, 'key');

    return this.table().get(key).run();
  }

  findOne(query) {
    return _assert(function () {
      return query.run({ cursor: true }).then(function (cursor) {
        return cursor.next().catch(function () {
          return null;
        });
      });
    }.apply(this, arguments), _t.Promise, 'return value');
  }
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=RethinkStore.js.map