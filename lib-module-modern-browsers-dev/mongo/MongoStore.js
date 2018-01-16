import { ObjectID } from 'mongodb';
import Collection from 'mongodb/lib/collection';
import Db from 'mongodb/lib/db';
import MongoConnection from './MongoConnection';
import AbstractStore from '../store/AbstractStore';
import MongoCursor from './MongoCursor';
import { InsertType as _InsertType, UpdateType as _UpdateType, ResultType as _ResultType } from '../types';

import t from 'flow-runtime';
const InsertType = t.tdz(function () {
  return _InsertType;
});
const UpdateType = t.tdz(function () {
  return _UpdateType;
});
const ResultType = t.tdz(function () {
  return _ResultType;
});
const MongoUpdateCommandResultType = t.type('MongoUpdateCommandResultType', t.object(t.property('result', t.exactObject(t.property('n', t.number()), t.property('nModified', t.number()), t.property('ok', t.number()))), t.property('connection', t.any()), t.property('modifiedCount', t.number()), t.property('upsertedId', t.null()), t.property('upsertedCount', t.number()), t.property('matchedCount', t.number())));
let MongoStore = class extends AbstractStore {

  constructor(connection, collectionName) {
    var _this;

    let _connectionType = t.ref(MongoConnection);

    let _collectionNameType = t.string();

    t.param('connection', _connectionType).assert(connection);
    t.param('collectionName', _collectionNameType).assert(collectionName);

    _this = super(connection);

    this.keyPath = '_id';
    t.bindTypeParameters(this, t.ref(MongoConnection));
    if (!collectionName) {
      throw new Error(`Invalid collectionName: "${collectionName}"`);
    }

    this._collection = connection.getConnection().then(function (db) {
      let _dbType = t.ref(Db);

      t.param('db', _dbType).assert(db);
      return _this._collection = db.collection(collectionName);
    }).catch(function (err) {
      return _this._collection = Promise.reject(err);
    });
  }

  get collection() {
    const _returnType2 = t.return(t.ref(Collection));

    if (this.connection.connectionFailed) {
      return Promise.reject(new Error('MongoDB connection failed')).then(function (_arg) {
        return _returnType2.assert(_arg);
      });
    }

    return Promise.resolve(this._collection).then(function (_arg2) {
      return _returnType2.assert(_arg2);
    });
  }

  create() {
    const _returnType3 = t.return(t.ref('Promise'));

    return _returnType3.assert(Promise.resolve());
  }

  insertOne(object) {
    let _objectType = t.ref(InsertType);

    const _returnType4 = t.return(t.ref(ResultType));

    t.param('object', _objectType).assert(object);

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
    }).then(function (_arg3) {
      return _returnType4.assert(_arg3);
    });
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object) {
    let _objectType2 = t.ref(InsertType);

    const _returnType5 = t.return(t.ref(ResultType));

    t.param('object', _objectType2).assert(object);

    if (!object.updated) {
      object.updated = new Date();
    }

    return this.collection.then(function (collection) {
      return collection.updateOne({ _id: object._id }, object);
    }).then(function () {
      return object;
    }).then(function (_arg4) {
      return _returnType5.assert(_arg4);
    });
  }

  upsertOne(object) {
    let _objectType3 = t.ref(InsertType);

    const _returnType6 = t.return(t.ref(ResultType));

    t.param('object', _objectType3).assert(object);

    if (!object.updated) {
      object.updated = new Date();
    }

    return this.collection.then(function (collection) {
      return collection.updateOne({ _id: object._id }, { $set: object }, { upsert: true });
    }).then(function () {
      return object;
    }).then(function (_arg5) {
      return _returnType6.assert(_arg5);
    });
  }

  replaceSeveral(objects) {
    var _this2 = this;

    let _objectsType = t.array(t.ref(InsertType));

    const _returnType7 = t.return(t.array(t.ref(ResultType)));

    t.param('objects', _objectsType).assert(objects);

    return Promise.all(objects.map(function (object) {
      return _this2.updateOne(object);
    })).then(function (_arg6) {
      return _returnType7.assert(_arg6);
    });
  }

  _partialUpdate(partialUpdate) {
    let _partialUpdateType = t.object();

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

  async partialUpdateByKey(key, partialUpdate) {
    let _keyType = t.any();

    let _partialUpdateType2 = t.ref(UpdateType);

    const _returnType = t.return(t.union(t.ref(ResultType), t.ref('Promise', t.ref(ResultType))));

    t.param('key', _keyType).assert(key);
    t.param('partialUpdate', _partialUpdateType2).assert(partialUpdate);

    partialUpdate = _partialUpdateType2.assert(this._partialUpdate(partialUpdate));
    const collection = await this.collection;
    const commandResult = MongoUpdateCommandResultType.assert((await collection.updateOne({ _id: key }, partialUpdate)));
    if (!commandResult.result.ok) {
      console.error(commandResult);
      throw new Error('Update failed');
    }
    return _returnType.assert(this.findByKey(key));
  }

  partialUpdateOne(object, partialUpdate) {
    let _objectType4 = t.ref(ResultType);

    let _partialUpdateType3 = t.ref(UpdateType);

    const _returnType8 = t.return(t.ref(ResultType));

    t.param('object', _objectType4).assert(object);
    t.param('partialUpdate', _partialUpdateType3).assert(partialUpdate);

    partialUpdate = _partialUpdateType3.assert(this._partialUpdate(partialUpdate));
    return this.partialUpdateByKey(object._id, partialUpdate).then(function (_arg7) {
      return _returnType8.assert(_arg7);
    });
  }

  partialUpdateMany(criteria, partialUpdate) {
    let _partialUpdateType4 = t.ref(UpdateType);

    const _returnType9 = t.return(t.void());

    t.param('partialUpdate', _partialUpdateType4).assert(partialUpdate);

    partialUpdate = _partialUpdateType4.assert(this._partialUpdate(partialUpdate));
    return this.collection.then(function (collection) {
      return collection.updateMany(criteria, partialUpdate);
    }).then(function () {
      return undefined;
    }).then(function (_arg8) {
      return _returnType9.assert(_arg8);
    }); // TODO return updated object
  }

  deleteByKey(key) {
    let _keyType2 = t.any();

    const _returnType10 = t.return(t.void());

    t.param('key', _keyType2).assert(key);

    return this.collection.then(function (collection) {
      return collection.removeOne({ _id: key });
    }).then(function () {
      return undefined;
    }).then(function (_arg9) {
      return _returnType10.assert(_arg9);
    });
  }

  cursor(criteria, sort) {
    var _this3 = this;

    let _criteriaType = t.nullable(t.object());

    let _sortType = t.nullable(t.object());

    const _returnType11 = t.return(t.ref(MongoCursor, t.ref(ResultType)));

    t.param('criteria', _criteriaType).assert(criteria);
    t.param('sort', _sortType).assert(sort);

    return this.collection.then(function (collection) {
      return collection.find(criteria);
    }).then(sort && function (cursor) {
      return cursor.sort(sort);
    }).then(function (cursor) {
      return new MongoCursor(_this3, cursor);
    }).then(function (_arg10) {
      return _returnType11.assert(_arg10);
    });
  }

  findByKey(key) {
    let _keyType3 = t.any();

    const _returnType12 = t.return(t.nullable(t.ref(ResultType)));

    t.param('key', _keyType3).assert(key);

    return this.findOne({ _id: key }).then(function (_arg11) {
      return _returnType12.assert(_arg11);
    });
  }

  findOne(criteria, sort) {
    let _criteriaType2 = t.object();

    let _sortType2 = t.nullable(t.object());

    const _returnType13 = t.return(t.nullable(t.ref(ResultType)));

    t.param('criteria', _criteriaType2).assert(criteria);
    t.param('sort', _sortType2).assert(sort);

    return this.collection.then(function (collection) {
      return collection.find(criteria);
    }).then(sort && function (cursor) {
      return cursor.sort(sort);
    }).then(function (cursor) {
      return cursor.limit(1).next();
    }).then(function (_arg12) {
      return _returnType13.assert(_arg12);
    });
  }
};
export { MongoStore as default };
//# sourceMappingURL=MongoStore.js.map