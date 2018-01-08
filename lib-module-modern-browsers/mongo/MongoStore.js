import { ObjectID } from 'mongodb';

import AbstractStore from '../store/AbstractStore';
import MongoCursor from './MongoCursor';
let MongoStore = class extends AbstractStore {

  constructor(connection, collectionName) {
    var _this = super(connection);

    this.keyPath = '_id';


    if (!collectionName) {
      throw new Error(`Invalid collectionName: "${collectionName}"`);
    }

    this._collection = connection.getConnection().then(function (db) {
      return _this._collection = db.collection(collectionName);
    }).catch(function (err) {
      return _this._collection = Promise.reject(err);
    });
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
      object._id = new ObjectID().toString();
    }
    if (!object.created) {
      object.created = new Date();
    }

    return this.collection.then(function (collection) {
      return collection.insertOne(object);
    }).then(function ({ result, connection, ops }) {
      if (!result.ok || result.n !== 1) {
        throw new Error('Fail to insert');
      }
    }).then(function () {
      return object;
    });
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object) {
    if (!object.updated) {
      object.updated = new Date();
    }

    return this.collection.then(function (collection) {
      return collection.updateOne({ _id: object._id }, object);
    }).then(function () {
      return object;
    });
  }

  upsertOne(object) {
    if (!object.updated) {
      object.updated = new Date();
    }

    return this.collection.then(function (collection) {
      return collection.updateOne({ _id: object._id }, { $set: object }, { upsert: true });
    }).then(function () {
      return object;
    });
  }

  replaceSeveral(objects) {
    var _this2 = this;

    return Promise.all(objects.map(function (object) {
      return _this2.updateOne(object);
    }));
  }

  _partialUpdate(partialUpdate) {
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

  async partialUpdateByKey(key, partialUpdate) {
    partialUpdate = this._partialUpdate(partialUpdate);
    const collection = await this.collection;
    const commandResult = await collection.updateOne({ _id: key }, partialUpdate);
    if (!commandResult.result.ok) {
      console.error(commandResult);
      throw new Error('Update failed');
    }
    return this.findByKey(key);
  }

  partialUpdateOne(object, partialUpdate) {
    var _this3 = this;

    partialUpdate = this._partialUpdate(partialUpdate);
    return this.partialUpdateByKey(object._id, partialUpdate).then(function () {
      return _this3.findByKey(object._id);
    });
  }

  partialUpdateMany(criteria, partialUpdate) {
    partialUpdate = this._partialUpdate(partialUpdate);
    return this.collection.then(function (collection) {
      return collection.updateMany(criteria, partialUpdate);
    }).then(function () {
      return null;
    }); // TODO return updated object
  }

  deleteByKey(key) {
    return this.collection.then(function (collection) {
      return collection.removeOne({ _id: key });
    }).then(function () {
      return null;
    });
  }

  cursor(criteria, sort) {
    var _this4 = this;

    return this.collection.then(function (collection) {
      return collection.find(criteria);
    }).then(sort && function (cursor) {
      return cursor.sort(sort);
    }).then(function (cursor) {
      return new MongoCursor(_this4, cursor);
    });
  }

  findByKey(key) {
    return this.findOne({ _id: key });
  }

  findOne(criteria, sort) {
    return this.collection.then(function (collection) {
      return collection.find(criteria);
    }).then(sort && function (cursor) {
      return cursor.sort(sort);
    }).then(function (cursor) {
      return cursor.limit(1).next();
    });
  }
};
export { MongoStore as default };
//# sourceMappingURL=MongoStore.js.map