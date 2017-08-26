var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { ObjectID } from 'mongodb';
import Collection from 'mongodb/lib/collection';
import Db from 'mongodb/lib/db';
import MongoConnection from './MongoConnection';
import AbstractStore from '../store/AbstractStore';
import MongoCursor from './MongoCursor';
import { InsertType as _InsertType, UpdateType as _UpdateType, ResultType as _ResultType } from '../types';

import t from 'flow-runtime';
var InsertType = t.tdz(function () {
  return _InsertType;
});
var UpdateType = t.tdz(function () {
  return _UpdateType;
});
var ResultType = t.tdz(function () {
  return _ResultType;
});

var MongoStore = function (_AbstractStore) {
  _inherits(MongoStore, _AbstractStore);

  function MongoStore(connection, collectionName) {
    _classCallCheck(this, MongoStore);

    var _connectionType = t.ref(MongoConnection);

    var _collectionNameType = t.string();

    t.param('connection', _connectionType).assert(connection);
    t.param('collectionName', _collectionNameType).assert(collectionName);

    var _this = _possibleConstructorReturn(this, (MongoStore.__proto__ || Object.getPrototypeOf(MongoStore)).call(this, connection));

    _this.keyPath = '_id';
    t.bindTypeParameters(_this, t.ref(MongoConnection));


    if (!collectionName) {
      throw new Error('Invalid collectionName: "' + collectionName + '"');
    }

    _this._collection = connection.getConnection().then(function (db) {
      var _dbType = t.ref(Db);

      t.param('db', _dbType).assert(db);
      return _this._collection = db.collection(collectionName);
    }).catch(function (err) {
      return _this._collection = Promise.reject(err);
    });
    return _this;
  }

  _createClass(MongoStore, [{
    key: 'create',
    value: function create() {
      var _returnType2 = t.return(t.ref('Promise'));

      return _returnType2.assert(Promise.resolve());
    }
  }, {
    key: 'insertOne',
    value: function insertOne(object) {
      var _objectType = t.ref(InsertType);

      var _returnType3 = t.return(t.ref(ResultType));

      t.param('object', _objectType).assert(object);

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
      }).then(function (_arg3) {
        return _returnType3.assert(_arg3);
      });
    }
  }, {
    key: 'updateOne',
    value: function updateOne(object) {
      return this.replaceOne(object);
    }
  }, {
    key: 'replaceOne',
    value: function replaceOne(object) {
      var _objectType2 = t.ref(InsertType);

      var _returnType4 = t.return(t.ref(ResultType));

      t.param('object', _objectType2).assert(object);

      if (!object.updated) {
        object.updated = new Date();
      }

      return this.collection.then(function (collection) {
        return collection.updateOne({ _id: object._id }, object);
      }).then(function () {
        return object;
      }).then(function (_arg4) {
        return _returnType4.assert(_arg4);
      });
    }
  }, {
    key: 'upsertOne',
    value: function upsertOne(object) {
      var _objectType3 = t.ref(InsertType);

      var _returnType5 = t.return(t.ref(ResultType));

      t.param('object', _objectType3).assert(object);

      if (!object.updated) {
        object.updated = new Date();
      }

      return this.collection.then(function (collection) {
        return collection.updateOne({ _id: object._id }, { $set: object }, { upsert: true });
      }).then(function () {
        return object;
      }).then(function (_arg5) {
        return _returnType5.assert(_arg5);
      });
    }
  }, {
    key: 'replaceSeveral',
    value: function replaceSeveral(objects) {
      var _this2 = this;

      var _objectsType = t.array(t.ref(InsertType));

      var _returnType6 = t.return(t.array(t.ref(ResultType)));

      t.param('objects', _objectsType).assert(objects);

      return Promise.all(objects.map(function (object) {
        return _this2.updateOne(object);
      })).then(function (_arg6) {
        return _returnType6.assert(_arg6);
      });
    }
  }, {
    key: '_partialUpdate',
    value: function _partialUpdate(partialUpdate) {
      var _partialUpdateType = t.object();

      t.param('partialUpdate', _partialUpdateType).assert(partialUpdate);

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
      var _keyType = t.any();

      var _partialUpdateType2 = t.ref(UpdateType);

      var _returnType7 = t.return(t.ref(ResultType));

      t.param('key', _keyType).assert(key);
      t.param('partialUpdate', _partialUpdateType2).assert(partialUpdate);

      partialUpdate = _partialUpdateType2.assert(this._partialUpdate(partialUpdate));
      return this.collection.then(function (collection) {
        return collection.updateOne({ _id: key }, partialUpdate);
      }).then(function (_arg7) {
        return _returnType7.assert(_arg7);
      });
    }
  }, {
    key: 'partialUpdateOne',
    value: function partialUpdateOne(object, partialUpdate) {
      var _this3 = this;

      var _objectType4 = t.ref(ResultType);

      var _partialUpdateType3 = t.ref(UpdateType);

      var _returnType8 = t.return(t.ref(ResultType));

      t.param('object', _objectType4).assert(object);
      t.param('partialUpdate', _partialUpdateType3).assert(partialUpdate);

      partialUpdate = _partialUpdateType3.assert(this._partialUpdate(partialUpdate));
      return this.partialUpdateByKey(object._id, partialUpdate).then(function () {
        return _this3.findByKey(object._id);
      }).then(function (_arg8) {
        return _returnType8.assert(_arg8);
      });
    }
  }, {
    key: 'partialUpdateMany',
    value: function partialUpdateMany(criteria, partialUpdate) {
      var _partialUpdateType4 = t.ref(UpdateType);

      var _returnType9 = t.return(t.void());

      t.param('partialUpdate', _partialUpdateType4).assert(partialUpdate);

      partialUpdate = _partialUpdateType4.assert(this._partialUpdate(partialUpdate));
      return this.collection.then(function (collection) {
        return collection.updateMany(criteria, partialUpdate);
      }).then(function () {
        return null;
      }).then(function (_arg9) {
        return _returnType9.assert(_arg9);
      }); // TODO return updated object
    }
  }, {
    key: 'deleteByKey',
    value: function deleteByKey(key) {
      var _keyType2 = t.any();

      var _returnType10 = t.return(t.void());

      t.param('key', _keyType2).assert(key);

      return this.collection.then(function (collection) {
        return collection.removeOne({ _id: key });
      }).then(function () {
        return null;
      }).then(function (_arg10) {
        return _returnType10.assert(_arg10);
      });
    }
  }, {
    key: 'cursor',
    value: function cursor(criteria, sort) {
      var _this4 = this;

      var _criteriaType = t.nullable(t.object());

      var _sortType = t.nullable(t.object());

      var _returnType11 = t.return(t.ref(MongoCursor, t.ref(ResultType)));

      t.param('criteria', _criteriaType).assert(criteria);
      t.param('sort', _sortType).assert(sort);

      return this.collection.then(function (collection) {
        return collection.find(criteria);
      }).then(sort && function (cursor) {
        return cursor.sort(sort);
      }).then(function (cursor) {
        return new MongoCursor(_this4, cursor);
      }).then(function (_arg11) {
        return _returnType11.assert(_arg11);
      });
    }
  }, {
    key: 'findByKey',
    value: function findByKey(key) {
      var _keyType3 = t.any();

      var _returnType12 = t.return(t.nullable(t.ref(ResultType)));

      t.param('key', _keyType3).assert(key);

      return this.findOne({ _id: key }).then(function (_arg12) {
        return _returnType12.assert(_arg12);
      });
    }
  }, {
    key: 'findOne',
    value: function findOne(criteria, sort) {
      var _criteriaType2 = t.object();

      var _sortType2 = t.nullable(t.object());

      var _returnType13 = t.return(t.nullable(t.ref(ResultType)));

      t.param('criteria', _criteriaType2).assert(criteria);
      t.param('sort', _sortType2).assert(sort);

      return this.collection.then(function (collection) {
        return collection.find(criteria);
      }).then(sort && function (cursor) {
        return cursor.sort(sort);
      }).then(function (cursor) {
        return cursor.limit(1).next();
      }).then(function (_arg13) {
        return _returnType13.assert(_arg13);
      });
    }
  }, {
    key: 'collection',
    get: function get() {
      var _returnType = t.return(t.ref(Collection));

      if (this.connection.connectionFailed) {
        return Promise.reject(new Error('MongoDB connection failed')).then(function (_arg) {
          return _returnType.assert(_arg);
        });
      }

      return Promise.resolve(this._collection).then(function (_arg2) {
        return _returnType.assert(_arg2);
      });
    }
  }]);

  return MongoStore;
}(AbstractStore);

export { MongoStore as default };
//# sourceMappingURL=MongoStore.js.map