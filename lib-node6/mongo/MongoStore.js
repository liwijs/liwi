'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongodb = require('mongodb');

var _AbstractStore = require('../store/AbstractStore');

var _AbstractStore2 = _interopRequireDefault(_AbstractStore);

var _MongoCursor = require('./MongoCursor');

var _MongoCursor2 = _interopRequireDefault(_MongoCursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let MongoStore = class extends _AbstractStore2.default {

  constructor(connection, collectionName) {

    if (super(connection), this.keyPath = '_id', !collectionName) throw new Error(`Invalid collectionName: "${collectionName}"`);

    this._collection = connection.getConnection().then(db => this._collection = db.collection(collectionName)).catch(err => this._collection = Promise.reject(err));
  }

  get collection() {
    return this.connection.connectionFailed ? Promise.reject(new Error('MongoDB connection failed')) : Promise.resolve(this._collection);
  }

  create() {
    return Promise.resolve();
  }

  insertOne(object) {

    return object._id || (object._id = new _mongodb.ObjectID().toString()), object.created || (object.created = new Date()), this.collection.then(collection => collection.insertOne(object)).then(({ result, connection, ops }) => {
      if (!result.ok || result.n !== 1) throw new Error('Fail to insert');
    }).then(() => object);
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object) {

    return object.updated || (object.updated = new Date()), this.collection.then(collection => collection.updateOne({ _id: object._id }, object)).then(() => object);
  }

  upsertOne(object) {

    return object.updated || (object.updated = new Date()), this.collection.then(collection => collection.updateOne({ _id: object._id }, { $set: object }, { upsert: true })).then(() => object);
  }

  replaceSeveral(objects) {
    return Promise.all(objects.map(object => this.updateOne(object)));
  }

  _partialUpdate(partialUpdate) {
    // https://docs.mongodb.com/manual/reference/operator/update/
    // if has a mongo operator
    return Object.keys(partialUpdate).some(key => key[0] === '$') ? partialUpdate : { $set: partialUpdate };
  }

  partialUpdateByKey(key, partialUpdate) {
    return partialUpdate = this._partialUpdate(partialUpdate), this.collection.then(collection => collection.updateOne({ _id: key }, partialUpdate));
  }

  partialUpdateOne(object, partialUpdate) {
    return partialUpdate = this._partialUpdate(partialUpdate), this.partialUpdateByKey(object._id, partialUpdate).then(() => this.findByKey(object._id));
  }

  partialUpdateMany(criteria, partialUpdate) {
    return partialUpdate = this._partialUpdate(partialUpdate), this.collection.then(collection => collection.updateMany(criteria, partialUpdate)).then(() => null); // TODO return updated object
  }

  deleteByKey(key) {
    return this.collection.then(collection => collection.removeOne({ _id: key })).then(() => null);
  }

  cursor(criteria, sort) {
    return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => new _MongoCursor2.default(this, cursor));
  }

  findByKey(key) {
    return this.findOne({ _id: key });
  }

  findOne(criteria, sort) {
    return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => cursor.limit(1).next());
  }
};
exports.default = MongoStore;
//# sourceMappingURL=MongoStore.js.map