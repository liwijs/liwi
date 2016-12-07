'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _RethinkConnection = require('./RethinkConnection');

var _RethinkConnection2 = _interopRequireDefault(_RethinkConnection);

var _AbstractStore = require('../store/AbstractStore');

var _AbstractStore2 = _interopRequireDefault(_AbstractStore);

var _Query = require('./Query');

var _Query2 = _interopRequireDefault(_Query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import RethinkCursor from './RethinkCursor';

class RethinkStore extends _AbstractStore2.default {

  constructor(connection, tableName) {
    _assert(connection, _RethinkConnection2.default, 'connection');

    _assert(tableName, _tcombForked2.default.String, 'tableName');

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
    _assert(criteria, _tcombForked2.default.maybe(_tcombForked2.default.Object), 'criteria');

    _assert(sort, _tcombForked2.default.maybe(_tcombForked2.default.Object), 'sort');

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
    return _assert(function () {
      return this.r.tableCreate(this._tableName);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  insertOne(object) {
    _assert(object, _tcombForked2.default.Any, 'object');

    return _assert(function () {
      if (!object.created) {
        object.created = new Date();
      }

      return this.table().insert(object).then(({ inserted, generated_keys: generatedKeys }) => {
        if (inserted !== 1) throw new Error('Could not insert');
        if (object.id == null) {
          object.id = generatedKeys[0];
        }
      }).then(() => object);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object) {
    _assert(object, _tcombForked2.default.Any, 'object');

    return _assert(function () {
      if (!object.updated) {
        object.updated = new Date();
      }

      return this.table().get(object.id).replace(object).then(() => object);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  upsertOne(object) {
    _assert(object, _tcombForked2.default.Any, 'object');

    return _assert(function () {
      if (!object.updated) {
        object.updated = new Date();
      }

      return this.table().insert(object, { conflict: 'replace' }).run().then(() => object);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  replaceSeveral(objects) {
    _assert(objects, _tcombForked2.default.list(_tcombForked2.default.Any), 'objects');

    return _assert(function () {
      return Promise.all(objects.map(object => this.replaceOne(object)));
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  partialUpdateByKey(key, partialUpdate) {
    _assert(key, _tcombForked2.default.Any, 'key');

    _assert(partialUpdate, _tcombForked2.default.Object, 'partialUpdate');

    return _assert(function () {
      return this.table().get(key).update(partialUpdate).run();
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  partialUpdateOne(object, partialUpdate) {
    _assert(object, _tcombForked2.default.Any, 'object');

    _assert(partialUpdate, _tcombForked2.default.Object, 'partialUpdate');

    return _assert(function () {
      return this.table().get(object.id).update(partialUpdate, { returnChanges: true }).then(res => res.changes.new_val);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  partialUpdateMany(criteria, partialUpdate) {
    _assert(partialUpdate, _tcombForked2.default.Object, 'partialUpdate');

    return _assert(function () {
      return this.table().filter(criteria).update(partialUpdate).run();
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  deleteByKey(key) {
    _assert(key, _tcombForked2.default.Any, 'key');

    return _assert(function () {
      return this.table().get(key).delete().run();
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  cursor(query, sort) {
    _assert(sort, _tcombForked2.default.maybe(_tcombForked2.default.Object), 'sort');

    // : Promise<RethinkCursor<ModelType>> {
    if (sort) throw new Error('sort is not supported');
    throw new Error('Not Supported yet, please use query().run({ cursor: true })');
  }

  findAll() {
    return _assert(function () {
      throw new Error('Not supported, please use query().run()');
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  findByKey(key) {
    _assert(key, _tcombForked2.default.Any, 'key');

    return this.table().get(key).run();
  }

  findOne(query) {
    return _assert(function () {
      return query.run({ cursor: true }).then(cursor => cursor.next().catch(() => null));
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }
}
exports.default = RethinkStore;

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=RethinkStore.js.map