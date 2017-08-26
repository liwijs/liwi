import RethinkConnection from './RethinkConnection';
import AbstractStore from '../store/AbstractStore';
import Query from './Query';
// import RethinkCursor from './RethinkCursor';
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
let RethinkStore = class extends AbstractStore {

  constructor(connection, tableName) {
    let _connectionType = t.ref(RethinkConnection);

    let _tableNameType = t.string();

    t.param('connection', _connectionType).assert(connection);
    t.param('tableName', _tableNameType).assert(tableName);

    super(connection);
    this.keyPath = 'id';
    t.bindTypeParameters(this, t.ref(RethinkConnection));
    this._tableName = tableName;
    this.r = this.connection._connection;
  }

  table() {
    return this.r.table(this._tableName);
  }

  createQuery(query) {
    return new Query(this, query);
  }

  query() {
    return this.table();
  }

  _query(criteria, sort) {
    var _this = this;

    let _criteriaType = t.nullable(t.object());

    let _sortType = t.nullable(t.object());

    t.param('criteria', _criteriaType).assert(criteria);
    t.param('sort', _sortType).assert(sort);

    const query = this.table();

    if (criteria) {
      query.filter(criteria);
    }

    if (sort) {
      Object.keys(sort).forEach(function (key) {
        if (sort[key] === -1) {
          query.orderBy(_this.r.desc(key));
        } else {
          query.orderBy(key);
        }
      });
    }

    return query;
  }

  create() {
    const _returnType = t.return(t.void());

    return this.r.tableCreate(this._tableName).then(function () {
      return null;
    }).then(function (_arg) {
      return _returnType.assert(_arg);
    });
  }

  insertOne(object) {
    let _objectType = t.ref(InsertType);

    const _returnType2 = t.return(t.ref(ResultType));

    t.param('object', _objectType).assert(object);

    if (!object.created) object.created = new Date();

    return this.table().insert(object).then(function ({ inserted, generated_keys: generatedKeys }) {
      if (inserted !== 1) throw new Error('Could not insert');
      if (object.id == null) {
        object.id = generatedKeys[0];
      }
    }).then(function () {
      return object;
    }).then(function (_arg2) {
      return _returnType2.assert(_arg2);
    });
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object) {
    let _objectType2 = t.ref(InsertType);

    const _returnType3 = t.return(t.ref(ResultType));

    t.param('object', _objectType2).assert(object);

    if (!object.created) object.created = new Date();
    if (!object.updated) object.updated = new Date();

    return this.table().get(object.id).replace(object).then(function () {
      return object;
    }).then(function (_arg3) {
      return _returnType3.assert(_arg3);
    });
  }

  upsertOne(object) {
    let _objectType3 = t.ref(UpdateType);

    const _returnType4 = t.return(t.ref(ResultType));

    t.param('object', _objectType3).assert(object);

    if (!object.updated) object.updated = new Date();

    return this.table().insert(object, { conflict: 'replace' }).run().then(function () {
      return object;
    }).then(function (_arg4) {
      return _returnType4.assert(_arg4);
    });
  }

  replaceSeveral(objects) {
    var _this2 = this;

    let _objectsType = t.array(t.ref(InsertType));

    const _returnType5 = t.return(t.array(t.ref(ResultType)));

    t.param('objects', _objectsType).assert(objects);

    return Promise.all(objects.map(function (object) {
      return _this2.replaceOne(object);
    })).then(function (_arg5) {
      return _returnType5.assert(_arg5);
    });
  }

  partialUpdateByKey(key, partialUpdate) {
    let _keyType = t.any();

    let _partialUpdateType = t.object();

    const _returnType6 = t.return(t.void());

    t.param('key', _keyType).assert(key);
    t.param('partialUpdate', _partialUpdateType).assert(partialUpdate);

    return this.table().get(key).update(partialUpdate).run().then(function (_arg6) {
      return _returnType6.assert(_arg6);
    });
  }

  partialUpdateOne(object, partialUpdate) {
    let _objectType4 = t.ref(ResultType);

    let _partialUpdateType2 = t.ref(UpdateType);

    const _returnType7 = t.return(t.ref(ResultType));

    t.param('object', _objectType4).assert(object);
    t.param('partialUpdate', _partialUpdateType2).assert(partialUpdate);

    return this.table().get(object.id).update(partialUpdate, { returnChanges: true }).then(function (res) {
      return res.changes[0].new_val;
    }).then(function (_arg7) {
      return _returnType7.assert(_arg7);
    });
  }

  partialUpdateMany(criteria, partialUpdate) {
    let _partialUpdateType3 = t.object();

    const _returnType8 = t.return(t.void());

    t.param('partialUpdate', _partialUpdateType3).assert(partialUpdate);

    return this.table().filter(criteria).update(partialUpdate).run().then(function (_arg8) {
      return _returnType8.assert(_arg8);
    });
  }

  deleteByKey(key) {
    let _keyType2 = t.any();

    const _returnType9 = t.return(t.void());

    t.param('key', _keyType2).assert(key);

    return this.table().get(key).delete().run().then(function (_arg9) {
      return _returnType9.assert(_arg9);
    });
  }

  cursor(query, sort) {
    let _sortType2 = t.nullable(t.object());

    t.param('sort', _sortType2).assert(sort);

    // : Promise<RethinkCursor<ModelType>> {
    if (sort) throw new Error('sort is not supported');
    throw new Error('Not Supported yet, please use query().run({ cursor: true })');
  }

  findAll() {
    t.return(t.void());

    throw new Error('Not supported, please use query().run()');
  }

  findByKey(key) {
    let _keyType3 = t.any();

    const _returnType11 = t.return(t.nullable(t.ref(ResultType)));

    t.param('key', _keyType3).assert(key);

    return this.table().get(key).run().then(function (_arg10) {
      return _returnType11.assert(_arg10);
    });
  }

  findOne(query) {
    const _returnType12 = t.return(t.nullable(t.ref(ResultType)));

    return query.run({ cursor: true }).then(function (cursor) {
      return cursor.next().catch(function () {
        return null;
      });
    }).then(function (_arg11) {
      return _returnType12.assert(_arg11);
    });
  }

  findValue(field, query) {
    let _fieldType = t.string();

    const _returnType13 = t.return(t.any());

    t.param('field', _fieldType).assert(field);

    return query.getField(field).run({ cursor: true }).then(function (cursor) {
      return cursor.next().catch(function () {
        return null;
      });
    }).then(function (_arg12) {
      return _returnType13.assert(_arg12);
    });
  }
};
export { RethinkStore as default };
//# sourceMappingURL=RethinkStore.js.map