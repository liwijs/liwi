'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _mongodb = require('mongodb');

var _AbstractStore = require('../store/AbstractStore');

var _AbstractStore2 = _interopRequireDefault(_AbstractStore);

var _MongoCursor = require('./MongoCursor');

var _MongoCursor2 = _interopRequireDefault(_MongoCursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let MongoStore = class extends _AbstractStore2.default {

  constructor(connection, collectionName) {
    super(connection);

    this.keyPath = '_id';
    if (!collectionName) {
      throw new Error(`Invalid collectionName: "${collectionName}"`);
    }

    this._collection = connection.getConnection().then(db => this._collection = db.collection(collectionName)).catch(err => this._collection = Promise.reject(err));
  }

  get collection() {
    if (this.connection.connectionFailed) {
      return Promise.reject(new Error('MongoDB connection failed'));
    }

    return Promise.resolve(this._collection);
  }

  create() {
    return Promise.resolve();
  }

  insertOne(object) {
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
    }).then(() => object);
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object) {
    if (!object.updated) {
      object.updated = new Date();
    }

    return this.collection.then(collection => collection.updateOne({ _id: object._id }, object)).then(() => object);
  }

  upsertOne(object) {
    if (!object.updated) {
      object.updated = new Date();
    }

    return this.collection.then(collection => collection.updateOne({ _id: object._id }, { $set: object }, { upsert: true })).then(() => object);
  }

  replaceSeveral(objects) {
    return Promise.all(objects.map(object => this.updateOne(object)));
  }

  _partialUpdate(partialUpdate) {
    // https://docs.mongodb.com/manual/reference/operator/update/
    // if has a mongo operator
    if (Object.keys(partialUpdate).some(key => key[0] === '$')) {
      return partialUpdate;
    } else {
      return { $set: partialUpdate };
    }
  }

  partialUpdateByKey(key, partialUpdate) {
    var _this = this;

    return _asyncToGenerator(function* () {
      partialUpdate = _this._partialUpdate(partialUpdate);
      const collection = yield _this.collection;
      const commandResult = yield collection.updateOne({ _id: key }, partialUpdate);
      if (!commandResult.result.ok) {
        console.error(commandResult);
        throw new Error('Update failed');
      }
      return _this.findByKey(key);
    })();
  }

  partialUpdateOne(object, partialUpdate) {
    partialUpdate = this._partialUpdate(partialUpdate);
    return this.partialUpdateByKey(object._id, partialUpdate);
  }

  partialUpdateMany(criteria, partialUpdate) {
    partialUpdate = this._partialUpdate(partialUpdate);
    return this.collection.then(collection => collection.updateMany(criteria, partialUpdate)).then(() => undefined); // TODO return updated object
  }

  deleteByKey(key) {
    return this.collection.then(collection => collection.removeOne({ _id: key })).then(() => undefined);
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