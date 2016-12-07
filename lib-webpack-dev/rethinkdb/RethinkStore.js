var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _t from 'tcomb-forked';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import RethinkConnection from './RethinkConnection';
import AbstractStore from '../store/AbstractStore';
import Query from './Query';
// import RethinkCursor from './RethinkCursor';

var RethinkStore = function (_AbstractStore) {
  _inherits(RethinkStore, _AbstractStore);

  function RethinkStore(connection, tableName) {
    _assert(connection, RethinkConnection, 'connection');

    _assert(tableName, _t.String, 'tableName');

    _classCallCheck(this, RethinkStore);

    var _this = _possibleConstructorReturn(this, (RethinkStore.__proto__ || Object.getPrototypeOf(RethinkStore)).call(this, connection));

    _this.keyPath = 'id';

    _this._tableName = tableName;
    _this.r = _this.connection._connection;
    return _this;
  }

  _createClass(RethinkStore, [{
    key: 'table',
    value: function table() {
      return this.r.table(this._tableName);
    }
  }, {
    key: 'createQuery',
    value: function createQuery(query) {
      return new Query(this, query);
    }
  }, {
    key: 'query',
    value: function query() {
      return this.table();
    }
  }, {
    key: '_query',
    value: function _query(criteria, sort) {
      var _this2 = this;

      _assert(criteria, _t.maybe(_t.Object), 'criteria');

      _assert(sort, _t.maybe(_t.Object), 'sort');

      var query = this.table();

      if (criteria) {
        query.filter(criteria);
      }

      if (sort) {
        Object.keys(sort).forEach(function (key) {
          if (sort[key] === -1) {
            query.orderBy(_this2.r.desc(key));
          } else {
            query.orderBy(key);
          }
        });
      }

      return query;
    }
  }, {
    key: 'create',
    value: function create() {
      return _assert(function () {
        return this.r.tableCreate(this._tableName);
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'insertOne',
    value: function insertOne(object) {
      _assert(object, _t.Any, 'object');

      return _assert(function () {
        if (!object.created) {
          object.created = new Date();
        }

        return this.table().insert(object).then(function (_ref) {
          var inserted = _ref.inserted,
              generatedKeys = _ref.generated_keys;

          if (inserted !== 1) throw new Error('Could not insert');
          if (object.id == null) {
            object.id = generatedKeys[0];
          }
        }).then(function () {
          return object;
        });
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'updateOne',
    value: function updateOne(object) {
      return this.replaceOne(object);
    }
  }, {
    key: 'replaceOne',
    value: function replaceOne(object) {
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
  }, {
    key: 'upsertOne',
    value: function upsertOne(object) {
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
  }, {
    key: 'replaceSeveral',
    value: function replaceSeveral(objects) {
      _assert(objects, _t.list(_t.Any), 'objects');

      return _assert(function () {
        var _this3 = this;

        return Promise.all(objects.map(function (object) {
          return _this3.replaceOne(object);
        }));
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'partialUpdateByKey',
    value: function partialUpdateByKey(key, partialUpdate) {
      _assert(key, _t.Any, 'key');

      _assert(partialUpdate, _t.Object, 'partialUpdate');

      return _assert(function () {
        return this.table().get(key).update(partialUpdate).run();
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'partialUpdateOne',
    value: function partialUpdateOne(object, partialUpdate) {
      _assert(object, _t.Any, 'object');

      _assert(partialUpdate, _t.Object, 'partialUpdate');

      return _assert(function () {
        return this.table().get(object.id).update(partialUpdate, { returnChanges: true }).then(function (res) {
          return res.changes.new_val;
        });
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'partialUpdateMany',
    value: function partialUpdateMany(criteria, partialUpdate) {
      _assert(partialUpdate, _t.Object, 'partialUpdate');

      return _assert(function () {
        return this.table().filter(criteria).update(partialUpdate).run();
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'deleteByKey',
    value: function deleteByKey(key) {
      _assert(key, _t.Any, 'key');

      return _assert(function () {
        return this.table().get(key).delete().run();
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'cursor',
    value: function cursor(query, sort) {
      _assert(sort, _t.maybe(_t.Object), 'sort');

      // : Promise<RethinkCursor<ModelType>> {
      if (sort) throw new Error('sort is not supported');
      throw new Error('Not Supported yet, please use query().run({ cursor: true })');
    }
  }, {
    key: 'findAll',
    value: function findAll() {
      return _assert(function () {
        throw new Error('Not supported, please use query().run()');
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'findByKey',
    value: function findByKey(key) {
      _assert(key, _t.Any, 'key');

      return this.table().get(key).run();
    }
  }, {
    key: 'findOne',
    value: function findOne(query) {
      return _assert(function () {
        return query.run({ cursor: true }).then(function (cursor) {
          return cursor.next().catch(function () {
            return null;
          });
        });
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }]);

  return RethinkStore;
}(AbstractStore);

export default RethinkStore;

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