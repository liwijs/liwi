'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

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

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const InsertType = _flowRuntime2.default.tdz(() => _types.InsertType);

const UpdateType = _flowRuntime2.default.tdz(() => _types.UpdateType);

const ResultType = _flowRuntime2.default.tdz(() => _types.ResultType);

let MongoStore = class extends _AbstractStore2.default {

  constructor(connection, collectionName) {
    let _connectionType = _flowRuntime2.default.ref(_MongoConnection2.default);

    let _collectionNameType = _flowRuntime2.default.string();

    _flowRuntime2.default.param('connection', _connectionType).assert(connection);

    _flowRuntime2.default.param('collectionName', _collectionNameType).assert(collectionName);

    super(connection);

    this.keyPath = '_id';

    _flowRuntime2.default.bindTypeParameters(this, _flowRuntime2.default.ref(_MongoConnection2.default));

    if (!collectionName) {
      throw new Error(`Invalid collectionName: "${collectionName}"`);
    }

    this._collection = connection.getConnection().then(db => {
      let _dbType = _flowRuntime2.default.ref(_db2.default);

      _flowRuntime2.default.param('db', _dbType).assert(db);

      return this._collection = db.collection(collectionName);
    }).catch(err => this._collection = Promise.reject(err));
  }

  get collection() {
    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(_collection2.default));

    if (this.connection.connectionFailed) {
      return Promise.reject(new Error('MongoDB connection failed')).then(_arg => _returnType.assert(_arg));
    }

    return Promise.resolve(this._collection).then(_arg2 => _returnType.assert(_arg2));
  }

  create() {
    const _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.ref('Promise'));

    return _returnType2.assert(Promise.resolve());
  }

  insertOne(object) {
    let _objectType = _flowRuntime2.default.ref(InsertType);

    const _returnType3 = _flowRuntime2.default.return(_flowRuntime2.default.ref(ResultType));

    _flowRuntime2.default.param('object', _objectType).assert(object);

    if (!object._id) {
      object._id = new _mongodb.ObjectID().toString();
    }
    if (!object.created) {
      object.created = new Date();
    }

    return this.collection.then(collection => collection.insertOne(object)).then(({ result, connection, ops }) => {
      if (!result.ok || result.n !== 1) {
        throw new Error('Fail to insert');
      }
    }).then(() => object).then(_arg3 => _returnType3.assert(_arg3));
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object) {
    let _objectType2 = _flowRuntime2.default.ref(InsertType);

    const _returnType4 = _flowRuntime2.default.return(_flowRuntime2.default.ref(ResultType));

    _flowRuntime2.default.param('object', _objectType2).assert(object);

    if (!object.updated) {
      object.updated = new Date();
    }

    return this.collection.then(collection => collection.updateOne({ _id: object._id }, object)).then(() => object).then(_arg4 => _returnType4.assert(_arg4));
  }

  upsertOne(object) {
    let _objectType3 = _flowRuntime2.default.ref(InsertType);

    const _returnType5 = _flowRuntime2.default.return(_flowRuntime2.default.ref(ResultType));

    _flowRuntime2.default.param('object', _objectType3).assert(object);

    if (!object.updated) {
      object.updated = new Date();
    }

    return this.collection.then(collection => collection.updateOne({ _id: object._id }, { $set: object }, { upsert: true })).then(() => object).then(_arg5 => _returnType5.assert(_arg5));
  }

  replaceSeveral(objects) {
    let _objectsType = _flowRuntime2.default.array(_flowRuntime2.default.ref(InsertType));

    const _returnType6 = _flowRuntime2.default.return(_flowRuntime2.default.array(_flowRuntime2.default.ref(ResultType)));

    _flowRuntime2.default.param('objects', _objectsType).assert(objects);

    return Promise.all(objects.map(object => this.updateOne(object))).then(_arg6 => _returnType6.assert(_arg6));
  }

  _partialUpdate(partialUpdate) {
    let _partialUpdateType = _flowRuntime2.default.object();

    _flowRuntime2.default.param('partialUpdate', _partialUpdateType).assert(partialUpdate);

    // https://docs.mongodb.com/manual/reference/operator/update/
    // if has a mongo operator
    if (Object.keys(partialUpdate).some(key => key[0] === '$')) {
      return partialUpdate;
    } else {
      return { $set: partialUpdate };
    }
  }

  partialUpdateByKey(key, partialUpdate) {
    let _keyType = _flowRuntime2.default.any();

    let _partialUpdateType2 = _flowRuntime2.default.ref(UpdateType);

    const _returnType7 = _flowRuntime2.default.return(_flowRuntime2.default.ref(ResultType));

    _flowRuntime2.default.param('key', _keyType).assert(key);

    _flowRuntime2.default.param('partialUpdate', _partialUpdateType2).assert(partialUpdate);

    partialUpdate = _partialUpdateType2.assert(this._partialUpdate(partialUpdate));
    return this.collection.then(collection => collection.updateOne({ _id: key }, partialUpdate)).then(_arg7 => _returnType7.assert(_arg7));
  }

  partialUpdateOne(object, partialUpdate) {
    let _objectType4 = _flowRuntime2.default.ref(ResultType);

    let _partialUpdateType3 = _flowRuntime2.default.ref(UpdateType);

    const _returnType8 = _flowRuntime2.default.return(_flowRuntime2.default.ref(ResultType));

    _flowRuntime2.default.param('object', _objectType4).assert(object);

    _flowRuntime2.default.param('partialUpdate', _partialUpdateType3).assert(partialUpdate);

    partialUpdate = _partialUpdateType3.assert(this._partialUpdate(partialUpdate));
    return this.partialUpdateByKey(object._id, partialUpdate).then(() => this.findByKey(object._id)).then(_arg8 => _returnType8.assert(_arg8));
  }

  partialUpdateMany(criteria, partialUpdate) {
    let _partialUpdateType4 = _flowRuntime2.default.ref(UpdateType);

    const _returnType9 = _flowRuntime2.default.return(_flowRuntime2.default.void());

    _flowRuntime2.default.param('partialUpdate', _partialUpdateType4).assert(partialUpdate);

    partialUpdate = _partialUpdateType4.assert(this._partialUpdate(partialUpdate));
    return this.collection.then(collection => collection.updateMany(criteria, partialUpdate)).then(() => null).then(_arg9 => _returnType9.assert(_arg9)); // TODO return updated object
  }

  deleteByKey(key) {
    let _keyType2 = _flowRuntime2.default.any();

    const _returnType10 = _flowRuntime2.default.return(_flowRuntime2.default.void());

    _flowRuntime2.default.param('key', _keyType2).assert(key);

    return this.collection.then(collection => collection.removeOne({ _id: key })).then(() => null).then(_arg10 => _returnType10.assert(_arg10));
  }

  cursor(criteria, sort) {
    let _criteriaType = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

    let _sortType = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

    const _returnType11 = _flowRuntime2.default.return(_flowRuntime2.default.ref(_MongoCursor2.default, _flowRuntime2.default.ref(ResultType)));

    _flowRuntime2.default.param('criteria', _criteriaType).assert(criteria);

    _flowRuntime2.default.param('sort', _sortType).assert(sort);

    return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => new _MongoCursor2.default(this, cursor)).then(_arg11 => _returnType11.assert(_arg11));
  }

  findByKey(key) {
    let _keyType3 = _flowRuntime2.default.any();

    const _returnType12 = _flowRuntime2.default.return(_flowRuntime2.default.nullable(_flowRuntime2.default.ref(ResultType)));

    _flowRuntime2.default.param('key', _keyType3).assert(key);

    return this.findOne({ _id: key }).then(_arg12 => _returnType12.assert(_arg12));
  }

  findOne(criteria, sort) {
    let _criteriaType2 = _flowRuntime2.default.object();

    let _sortType2 = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

    const _returnType13 = _flowRuntime2.default.return(_flowRuntime2.default.nullable(_flowRuntime2.default.ref(ResultType)));

    _flowRuntime2.default.param('criteria', _criteriaType2).assert(criteria);

    _flowRuntime2.default.param('sort', _sortType2).assert(sort);

    return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => cursor.limit(1).next()).then(_arg13 => _returnType13.assert(_arg13));
  }
};
exports.default = MongoStore;
//# sourceMappingURL=MongoStore.js.map