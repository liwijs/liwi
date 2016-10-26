var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _t from 'tcomb-forked';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { ObjectID } from 'mongodb';

import Db from 'mongodb/lib/db';
import MongoConnection from './MongoConnection';
import AbstractStore from '../store/AbstractStore';
import MongoCursor from './MongoCursor';

var MongoStore = function (_AbstractStore) {
  _inherits(MongoStore, _AbstractStore);

  function MongoStore(connection, collectionName) {
    _assert(connection, MongoConnection, 'connection');

    _assert(collectionName, _t.String, 'collectionName');

    _classCallCheck(this, MongoStore);

    var _this = _possibleConstructorReturn(this, (MongoStore.__proto__ || Object.getPrototypeOf(MongoStore)).call(this, connection));

    _this.keyPath = '_id';


    if (!collectionName) {
      throw new Error('Invalid collectionName: "' + collectionName + '"');
    }

    _this._collection = connection.getConnection().then(function (db) {
      _assert(db, Db, 'db');

      return _this._collection = db.collection(collectionName);
    }).catch(function (err) {
      return _this._collection = Promise.reject(err);
    });
    return _this;
  }

  _createClass(MongoStore, [{
    key: 'create',
    value: function create() {
      return _assert(function () {
        return Promise.resolve();
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'insertOne',
    value: function insertOne(object) {
      _assert(object, _t.Any, 'object');

      return _assert(function () {
        if (!object._id) {
          object._id = new ObjectID().toString();
        }
        if (!object.created) {
          object.created = new Date();
        }

        return this.collection.then(function (collection) {
          return collection.insertOne(object);
        }).then(function (_ref) {
          var result = _ref.result,
              connection = _ref.connection,
              ops = _ref.ops;

          if (!result.ok || result.n !== 1) {
            throw new Error('Fail to insert');
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

        return this.collection.then(function (collection) {
          return collection.updateOne({ _id: object._id }, object);
        }).then(function () {
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

        return this.collection.then(function (collection) {
          return collection.updateOne({ _id: object._id }, { $set: object }, { upsert: true });
        }).then(function () {
          return object;
        });
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'replaceSeveral',
    value: function replaceSeveral(objects) {
      _assert(objects, _t.list(_t.Any), 'objects');

      return _assert(function () {
        var _this2 = this;

        return Promise.all(objects.map(function (object) {
          return _this2.updateOne(object);
        }));
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: '_partialUpdate',
    value: function _partialUpdate(partialUpdate) {
      _assert(partialUpdate, _t.Object, 'partialUpdate');

      // https://docs.mongodb.com/manual/reference/operator/update/
      // if has a mongo operator
      if (Object.keys(partialUpdate).some(function (key) {
        return key[0] === '$';
      })) {
        return partialUpdate;
      } else {
        return { $set: partialUpdate };
      }
    }
  }, {
    key: 'partialUpdateByKey',
    value: function partialUpdateByKey(key, partialUpdate) {
      _assert(key, _t.Any, 'key');

      _assert(partialUpdate, _t.Object, 'partialUpdate');

      return _assert(function () {
        partialUpdate = this._partialUpdate(partialUpdate);
        return this.collection.then(function (collection) {
          return collection.updateOne({ _id: key }, partialUpdate);
        });
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'partialUpdateOne',
    value: function partialUpdateOne(object, partialUpdate) {
      _assert(object, _t.Any, 'object');

      _assert(partialUpdate, _t.Object, 'partialUpdate');

      return _assert(function () {
        var _this3 = this;

        partialUpdate = this._partialUpdate(partialUpdate);
        return this.partialUpdateByKey(object._id, partialUpdate).then(function (res) {
          return _this3.findByKey(object._id);
        });
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'partialUpdateMany',
    value: function partialUpdateMany(criteria, partialUpdate) {
      _assert(partialUpdate, _t.Object, 'partialUpdate');

      return _assert(function () {
        partialUpdate = this._partialUpdate(partialUpdate);
        return this.collection.then(function (collection) {
          return collection.updateMany(criteria, partialUpdate);
        }).then(function (res) {
          return null;
        }); // TODO return updated object
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'deleteByKey',
    value: function deleteByKey(key) {
      _assert(key, _t.Any, 'key');

      return _assert(function () {
        return this.collection.then(function (collection) {
          return collection.removeOne({ _id: key });
        }).then(function () {
          return null;
        });
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'cursor',
    value: function cursor(criteria, sort) {
      _assert(criteria, _t.maybe(_t.Object), 'criteria');

      _assert(sort, _t.maybe(_t.Object), 'sort');

      return _assert(function () {
        var _this4 = this;

        return this.collection.then(function (collection) {
          return collection.find(criteria);
        }).then(sort && function (cursor) {
          return cursor.sort(sort);
        }).then(function (cursor) {
          return new MongoCursor(_this4, cursor);
        });
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'findByKey',
    value: function findByKey(key) {
      _assert(key, _t.Any, 'key');

      return this.findOne({ _id: key });
    }
  }, {
    key: 'findOne',
    value: function findOne(criteria, sort) {
      _assert(criteria, _t.Object, 'criteria');

      _assert(sort, _t.maybe(_t.Object), 'sort');

      return _assert(function () {
        return this.collection.then(function (collection) {
          return collection.find(criteria);
        }).then(sort && function (cursor) {
          return cursor.sort(sort);
        }).then(function (cursor) {
          return cursor.limit(1).next();
        });
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'collection',
    get: function get() {
      return _assert(function () {
        if (this.connection.connectionFailed) {
          return Promise.reject(new Error('MongoDB connection failed'));
        }

        return Promise.resolve(this._collection);
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }]);

  return MongoStore;
}(AbstractStore);

export default MongoStore;

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
//# sourceMappingURL=MongoStore.js.map