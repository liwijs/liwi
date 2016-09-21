'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _mongodb = require('mongodb');

var _collection = require('mongodb/lib/collection');

var _collection2 = _interopRequireDefault(_collection);

var _db = require('mongodb/lib/db');

var _db2 = _interopRequireDefault(_db);

var _MongoConnection = require('./MongoConnection');

var _MongoConnection2 = _interopRequireDefault(_MongoConnection);

var _AbstractStore = require('../store/AbstractStore');

var _AbstractStore2 = _interopRequireDefault(_AbstractStore);

var _MongoCursor = require('./MongoCursor');

var _MongoCursor2 = _interopRequireDefault(_MongoCursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MongoStore extends _AbstractStore2.default {

  constructor(connection, collectionName) {
    _assert(connection, _MongoConnection2.default, 'connection');

    _assert(collectionName, _tcombForked2.default.String, 'collectionName');

    super(connection);

    this.keyPath = '_id';
    if (!collectionName) {
      throw new Error(`Invalid collectionName: "${ collectionName }"`);
    }

    this._collection = connection.getConnection().then(db => {
      _assert(db, _db2.default, 'db');

      return this._collection = db.collection(collectionName);
    }).catch(err => this._collection = Promise.reject(err));
  }

  get collection() {
    return _assert(function () {
      if (this.connection.connectionFailed) {
        return Promise.reject(new Error('MongoDB connection failed'));
      }

      return Promise.resolve(this._collection);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  create() {
    return _assert(function () {
      return Promise.resolve();
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  insertOne(object) {
    _assert(object, _tcombForked2.default.Any, 'object');

    return _assert(function () {
      if (!object._id) {
        object._id = new _mongodb.ObjectID().toString();
      }
      if (!object.created) {
        object.created = new Date();
      }

      return this.collection.then(collection => collection.insertOne(object)).then(_ref => {
        let result = _ref.result;
        let connection = _ref.connection;
        let ops = _ref.ops;

        if (!result.ok || result.n !== 1) {
          throw new Error('Fail to insert');
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

      return this.collection.then(collection => collection.updateOne({ _id: object._id }, object)).then(() => object);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  upsertOne(object) {
    _assert(object, _tcombForked2.default.Any, 'object');

    return _assert(function () {
      if (!object.updated) {
        object.updated = new Date();
      }

      return this.collection.then(collection => collection.updateOne({ _id: object._id }, { $set: object }, { upsert: true })).then(() => object);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  replaceSeveral(objects) {
    _assert(objects, _tcombForked2.default.list(_tcombForked2.default.Any), 'objects');

    return _assert(function () {
      return Promise.all(objects.map(object => this.updateOne(object)));
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  _partialUpdate(partialUpdate) {
    _assert(partialUpdate, _tcombForked2.default.Object, 'partialUpdate');

    // https://docs.mongodb.com/manual/reference/operator/update/
    // if has a mongo operator
    if (Object.keys(partialUpdate).some(key => key[0] === '$')) {
      return partialUpdate;
    } else {
      return { $set: partialUpdate };
    }
  }

  partialUpdateByKey(key, partialUpdate) {
    _assert(key, _tcombForked2.default.Any, 'key');

    _assert(partialUpdate, _tcombForked2.default.Object, 'partialUpdate');

    return _assert(function () {
      partialUpdate = this._partialUpdate(partialUpdate);
      return this.collection.then(collection => collection.updateOne({ _id: key }, partialUpdate));
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  partialUpdateOne(object, partialUpdate) {
    _assert(object, _tcombForked2.default.Any, 'object');

    _assert(partialUpdate, _tcombForked2.default.Object, 'partialUpdate');

    return _assert(function () {
      partialUpdate = this._partialUpdate(partialUpdate);
      return this.partialUpdateByKey(object._id, partialUpdate).then(res => this.findByKey(object._id));
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  partialUpdateMany(criteria, partialUpdate) {
    _assert(partialUpdate, _tcombForked2.default.Object, 'partialUpdate');

    return _assert(function () {
      partialUpdate = this._partialUpdate(partialUpdate);
      return this.collection.then(collection => collection.updateMany(criteria, partialUpdate)).then(res => null); // TODO return updated object
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  deleteByKey(key) {
    _assert(key, _tcombForked2.default.Any, 'key');

    return _assert(function () {
      return this.collection.then(collection => collection.removeOne({ _id: key })).then(() => null);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  cursor(criteria, sort) {
    _assert(criteria, _tcombForked2.default.maybe(_tcombForked2.default.Object), 'criteria');

    _assert(sort, _tcombForked2.default.maybe(_tcombForked2.default.Object), 'sort');

    return _assert(function () {
      return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => new _MongoCursor2.default(this, cursor));
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  findByKey(key) {
    _assert(key, _tcombForked2.default.Any, 'key');

    return this.findOne({ _id: key });
  }

  findOne(criteria, sort) {
    _assert(criteria, _tcombForked2.default.Object, 'criteria');

    _assert(sort, _tcombForked2.default.maybe(_tcombForked2.default.Object), 'sort');

    return _assert(function () {
      return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => cursor.limit(1).next());
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }
}
exports.default = MongoStore;

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }

    return type(x);
  }

  if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=MongoStore.js.map