import _t from 'tcomb-forked';
import { ObjectID } from 'mongodb';

import Db from 'mongodb/lib/db';
import MongoConnection from './MongoConnection';
import AbstractStore from '../store/AbstractStore';
import MongoCursor from './MongoCursor';

export default class MongoStore extends AbstractStore {

  constructor(connection, collectionName) {
    _assert(connection, MongoConnection, 'connection');

    _assert(collectionName, _t.String, 'collectionName');

    super(connection);

    this.keyPath = '_id';
    if (!collectionName) {
      throw new Error(`Invalid collectionName: "${ collectionName }"`);
    }

    this._collection = connection.getConnection().then(db => {
      _assert(db, Db, 'db');

      return this._collection = db.collection(collectionName);
    }).catch(err => this._collection = Promise.reject(err));
  }

  get collection() {
    return _assert(function () {
      if (this.connection.connectionFailed) {
        return Promise.reject(new Error('MongoDB connection failed'));
      }

      return Promise.resolve(this._collection);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  create() {
    return _assert(function () {
      return Promise.resolve();
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  insertOne(object) {
    _assert(object, _t.Any, 'object');

    return _assert(function () {
      if (!object._id) {
        object._id = new ObjectID().toString();
      }
      if (!object.created) {
        object.created = new Date();
      }

      return this.collection.then(collection => collection.insertOne(object)).then((_ref) => {
        var result = _ref.result,
            connection = _ref.connection,
            ops = _ref.ops;

        if (!result.ok || result.n !== 1) {
          throw new Error('Fail to insert');
        }
      }).then(() => object);
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

      return this.collection.then(collection => collection.updateOne({ _id: object._id }, object)).then(() => object);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  upsertOne(object) {
    _assert(object, _t.Any, 'object');

    return _assert(function () {
      if (!object.updated) {
        object.updated = new Date();
      }

      return this.collection.then(collection => collection.updateOne({ _id: object._id }, { $set: object }, { upsert: true })).then(() => object);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  replaceSeveral(objects) {
    _assert(objects, _t.list(_t.Any), 'objects');

    return _assert(function () {
      return Promise.all(objects.map(object => this.updateOne(object)));
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  _partialUpdate(partialUpdate) {
    _assert(partialUpdate, _t.Object, 'partialUpdate');

    // https://docs.mongodb.com/manual/reference/operator/update/
    // if has a mongo operator
    if (Object.keys(partialUpdate).some(key => key[0] === '$')) {
      return partialUpdate;
    } else {
      return { $set: partialUpdate };
    }
  }

  partialUpdateByKey(key, partialUpdate) {
    _assert(key, _t.Any, 'key');

    _assert(partialUpdate, _t.Object, 'partialUpdate');

    return _assert(function () {
      partialUpdate = this._partialUpdate(partialUpdate);
      return this.collection.then(collection => collection.updateOne({ _id: key }, partialUpdate));
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  partialUpdateOne(object, partialUpdate) {
    _assert(object, _t.Any, 'object');

    _assert(partialUpdate, _t.Object, 'partialUpdate');

    return _assert(function () {
      partialUpdate = this._partialUpdate(partialUpdate);
      return this.partialUpdateByKey(object._id, partialUpdate).then(res => this.findByKey(object._id));
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  partialUpdateMany(criteria, partialUpdate) {
    _assert(partialUpdate, _t.Object, 'partialUpdate');

    return _assert(function () {
      partialUpdate = this._partialUpdate(partialUpdate);
      return this.collection.then(collection => collection.updateMany(criteria, partialUpdate)).then(res => null); // TODO return updated object
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  deleteByKey(key) {
    _assert(key, _t.Any, 'key');

    return _assert(function () {
      return this.collection.then(collection => collection.removeOne({ _id: key })).then(() => null);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  cursor(criteria, sort) {
    _assert(criteria, _t.maybe(_t.Object), 'criteria');

    _assert(sort, _t.maybe(_t.Object), 'sort');

    return _assert(function () {
      return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => new MongoCursor(this, cursor));
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  findByKey(key) {
    _assert(key, _t.Any, 'key');

    return this.findOne({ _id: key });
  }

  findOne(criteria, sort) {
    _assert(criteria, _t.Object, 'criteria');

    _assert(sort, _t.maybe(_t.Object), 'sort');

    return _assert(function () {
      return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => cursor.limit(1).next());
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
//# sourceMappingURL=MongoStore.js.map