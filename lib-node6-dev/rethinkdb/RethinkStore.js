'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _RethinkConnection = require('./RethinkConnection');

var _RethinkConnection2 = _interopRequireDefault(_RethinkConnection);

var _AbstractStore = require('../store/AbstractStore');

var _AbstractStore2 = _interopRequireDefault(_AbstractStore);

var _Query = require('./Query');

var _Query2 = _interopRequireDefault(_Query);

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import RethinkCursor from './RethinkCursor';
const InsertType = _flowRuntime2.default.tdz(() => _types.InsertType);

const UpdateType = _flowRuntime2.default.tdz(() => _types.UpdateType);

const ResultType = _flowRuntime2.default.tdz(() => _types.ResultType);

let RethinkStore = class extends _AbstractStore2.default {

  constructor(connection, tableName) {
    let _connectionType = _flowRuntime2.default.ref(_RethinkConnection2.default);

    let _tableNameType = _flowRuntime2.default.string();

    _flowRuntime2.default.param('connection', _connectionType).assert(connection), _flowRuntime2.default.param('tableName', _tableNameType).assert(tableName), super(connection), this.keyPath = 'id', _flowRuntime2.default.bindTypeParameters(this, _flowRuntime2.default.ref(_RethinkConnection2.default)), this._tableName = tableName, this.r = this.connection._connection;
  }

  table() {
    return this.r.table(this._tableName);
  }

  createQuery(query) {
    return new _Query2.default(this, query);
  }

  query() {
    return this.table();
  }

  _query(criteria, sort) {
    let _criteriaType = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

    let _sortType = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

    _flowRuntime2.default.param('criteria', _criteriaType).assert(criteria), _flowRuntime2.default.param('sort', _sortType).assert(sort);

    const query = this.table();

    return criteria && query.filter(criteria), sort && Object.keys(sort).forEach(key => {
      sort[key] === -1 ? query.orderBy(this.r.desc(key)) : query.orderBy(key);
    }), query;
  }

  create() {
    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.void());

    return this.r.tableCreate(this._tableName).then(() => null).then(_arg => _returnType.assert(_arg));
  }

  insertOne(object) {
    let _objectType = _flowRuntime2.default.ref(InsertType);

    const _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.ref(ResultType));

    return _flowRuntime2.default.param('object', _objectType).assert(object), object.created || (object.created = new Date()), this.table().insert(object).then(({ inserted, generated_keys: generatedKeys }) => {
      if (inserted !== 1) throw new Error('Could not insert');
      object.id == null && (object.id = generatedKeys[0]);
    }).then(() => object).then(_arg2 => _returnType2.assert(_arg2));
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object) {
    let _objectType2 = _flowRuntime2.default.ref(InsertType);

    const _returnType3 = _flowRuntime2.default.return(_flowRuntime2.default.ref(ResultType));

    return _flowRuntime2.default.param('object', _objectType2).assert(object), object.created || (object.created = new Date()), object.updated || (object.updated = new Date()), this.table().get(object.id).replace(object).then(() => object).then(_arg3 => _returnType3.assert(_arg3));
  }

  upsertOne(object) {
    let _objectType3 = _flowRuntime2.default.ref(UpdateType);

    const _returnType4 = _flowRuntime2.default.return(_flowRuntime2.default.ref(ResultType));

    return _flowRuntime2.default.param('object', _objectType3).assert(object), object.updated || (object.updated = new Date()), this.table().insert(object, { conflict: 'replace' }).run().then(() => object).then(_arg4 => _returnType4.assert(_arg4));
  }

  replaceSeveral(objects) {
    let _objectsType = _flowRuntime2.default.array(_flowRuntime2.default.ref(InsertType));

    const _returnType5 = _flowRuntime2.default.return(_flowRuntime2.default.array(_flowRuntime2.default.ref(ResultType)));

    return _flowRuntime2.default.param('objects', _objectsType).assert(objects), Promise.all(objects.map(object => this.replaceOne(object))).then(_arg5 => _returnType5.assert(_arg5));
  }

  partialUpdateByKey(key, partialUpdate) {
    let _keyType = _flowRuntime2.default.any();

    let _partialUpdateType = _flowRuntime2.default.object();

    const _returnType6 = _flowRuntime2.default.return(_flowRuntime2.default.void());

    return _flowRuntime2.default.param('key', _keyType).assert(key), _flowRuntime2.default.param('partialUpdate', _partialUpdateType).assert(partialUpdate), this.table().get(key).update(partialUpdate).run().then(_arg6 => _returnType6.assert(_arg6));
  }

  partialUpdateOne(object, partialUpdate) {
    let _objectType4 = _flowRuntime2.default.ref(ResultType);

    let _partialUpdateType2 = _flowRuntime2.default.ref(UpdateType);

    const _returnType7 = _flowRuntime2.default.return(_flowRuntime2.default.ref(ResultType));

    return _flowRuntime2.default.param('object', _objectType4).assert(object), _flowRuntime2.default.param('partialUpdate', _partialUpdateType2).assert(partialUpdate), this.table().get(object.id).update(partialUpdate, { returnChanges: true }).then(res => res.changes.new_val).then(_arg7 => _returnType7.assert(_arg7));
  }

  partialUpdateMany(criteria, partialUpdate) {
    let _partialUpdateType3 = _flowRuntime2.default.object();

    const _returnType8 = _flowRuntime2.default.return(_flowRuntime2.default.void());

    return _flowRuntime2.default.param('partialUpdate', _partialUpdateType3).assert(partialUpdate), this.table().filter(criteria).update(partialUpdate).run().then(_arg8 => _returnType8.assert(_arg8));
  }

  deleteByKey(key) {
    let _keyType2 = _flowRuntime2.default.any();

    const _returnType9 = _flowRuntime2.default.return(_flowRuntime2.default.void());

    return _flowRuntime2.default.param('key', _keyType2).assert(key), this.table().get(key).delete().run().then(_arg9 => _returnType9.assert(_arg9));
  }

  cursor(query, sort) {
    let _sortType2 = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

    // : Promise<RethinkCursor<ModelType>> {
    if (_flowRuntime2.default.param('sort', _sortType2).assert(sort), sort) throw new Error('sort is not supported');
    throw new Error('Not Supported yet, please use query().run({ cursor: true })');
  }

  findAll() {
    _flowRuntime2.default.return(_flowRuntime2.default.void());

    throw new Error('Not supported, please use query().run()');
  }

  findByKey(key) {
    let _keyType3 = _flowRuntime2.default.any();

    const _returnType11 = _flowRuntime2.default.return(_flowRuntime2.default.nullable(_flowRuntime2.default.ref(ResultType)));

    return _flowRuntime2.default.param('key', _keyType3).assert(key), this.table().get(key).run().then(_arg10 => _returnType11.assert(_arg10));
  }

  findOne(query) {
    const _returnType12 = _flowRuntime2.default.return(_flowRuntime2.default.nullable(_flowRuntime2.default.ref(ResultType)));

    return query.run({ cursor: true }).then(cursor => cursor.next().catch(() => null)).then(_arg11 => _returnType12.assert(_arg11));
  }

  findValue(field, query) {
    let _fieldType = _flowRuntime2.default.string();

    const _returnType13 = _flowRuntime2.default.return(_flowRuntime2.default.any());

    return _flowRuntime2.default.param('field', _fieldType).assert(field), query.getField(field).run({ cursor: true }).then(cursor => cursor.next().catch(() => null)).then(_arg12 => _returnType13.assert(_arg12));
  }
};
exports.default = RethinkStore;
//# sourceMappingURL=RethinkStore.js.map