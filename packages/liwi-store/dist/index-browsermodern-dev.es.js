import t from 'flow-runtime';
import assert from 'assert';

let AbstractConnection = class {};

const InsertType = t.type("InsertType", t.object());
const UpdateType = t.type("UpdateType", t.object());
const ResultType = t.type("ResultType", t.object(t.property("created", t.union(t.ref("Date"), t.object()))));

const CursorInterfaceType = t.type("CursorInterfaceType", t.object(t.property("close", t.function(t.return(t.union(t.ref("Promise", t.void()), t.void())))), t.property("next", t.function(t.return(t.ref("Promise", t.any())))), t.property("nextResult", t.function(t.return(t.ref("Promise", t.any())))), t.property("limit", t.function(t.param("newLimit", t.number()), t.return(t.ref("Promise", t.void())))), t.property("count", t.function(t.param("applyLimit", t.nullable(t.boolean())), t.return(t.ref("Promise", t.number())))), t.property("result", t.function(t.return(t.ref("Promise", ResultType)))), t.property("delete", t.function(t.return(t.ref("Promise", t.void())))), t.property("forEachKeys", t.function(t.param("callback", t.function()), t.return(t.ref("Promise", t.void())))), t.property("forEach", t.function(t.param("callback", t.function()), t.return(t.ref("Promise", t.void()))))));

const StoreInterfaceType = t.type("StoreInterfaceType", t.object(t.property("create", t.function(t.return(t.ref("Promise", t.void())))), t.property("insertOne", t.function(t.param("object", InsertType), t.return(t.ref("Promise", ResultType)))), t.property("replaceOne", t.function(t.param("object", InsertType), t.return(t.ref("Promise", ResultType)))), t.property("upsertOne", t.function(t.param("object", InsertType), t.return(t.ref("Promise", ResultType)))), t.property("updateSeveral", t.function(t.param("objects", t.array(UpdateType)), t.return(t.ref("Promise", t.array(ResultType))))), t.property("partialUpdateByKey", t.function(t.param("key", t.any()), t.param("partialUpdate", UpdateType), t.return(t.ref("Promise", ResultType)))), t.property("partialUpdateOne", t.function(t.param("object", ResultType), t.param("partialUpdate", UpdateType), t.return(t.ref("Promise", ResultType)))), t.property("partialUpdateMany", t.function(t.param("criteria", t.object()), t.param("partialUpdate", UpdateType), t.return(t.ref("Promise", t.void())))), t.property("deleteByKey", t.function(t.param("key", t.any()), t.return(t.ref("Promise", t.void())))), t.property("cursor", t.function(t.param("criteria", t.nullable(t.object())), t.param("sort", t.nullable(t.object())), t.return(t.ref("Promise", t.ref(CursorInterfaceType, ResultType))))), t.property("findAll", t.function(t.param("criteria", t.nullable(t.object())), t.param("sort", t.nullable(t.object())), t.return(t.ref("Promise", t.array(ResultType))))), t.property("findByKey", t.function(t.param("key", t.any()), t.return(t.ref("Promise", t.nullable(ResultType))))), t.property("findOne", t.function(t.param("criteria", t.object()), t.param("sort", t.nullable(t.object())), t.return(t.ref("Promise", t.nullable(ResultType)))))));

var _class, _temp;
const ResultType$1 = t.tdz(function () {
  return ResultType;
});

const _AbstractCursorTypeParametersSymbol = Symbol('AbstractCursorTypeParameters');

let AbstractCursor = (_temp = _class = class {

  constructor(store) {
    this[_AbstractCursorTypeParametersSymbol] = {
      Store: t.typeParameter('Store')
    };

    let _storeType = t.flowInto(this[_AbstractCursorTypeParametersSymbol].Store);

    t.param('store', _storeType).assert(store);

    this._store = store;
  }

  get store() {
    const _returnType2 = t.return(this[_AbstractCursorTypeParametersSymbol].Store);

    return _returnType2.assert(this._store);
  }

  close() {
    throw new Error('close() missing implementation');
  }

  next() {
    t.return(t.any());

    throw new Error('next() missing implementation');
  }

  nextResult() {
    var _this = this;

    const _returnType4 = t.return(t.any());

    return this.next().then(function () {
      return _this.result();
    }).then(function (_arg) {
      return _returnType4.assert(_arg);
    });
  }

  limit(newLimit) {
    let _newLimitType = t.number();

    t.return(t.void());
    t.param('newLimit', _newLimitType).assert(newLimit);

    throw new Error('limit() missing implementation');
  }

  count(applyLimit = false) {
    let _applyLimitType = t.boolean();

    t.param('applyLimit', _applyLimitType).assert(applyLimit);

    throw new Error('count() missing implementation');
  }

  result() {
    const _returnType6 = t.return(t.ref(ResultType$1));

    return this.store.findByKey(this.key).then(function (_arg2) {
      return _returnType6.assert(_arg2);
    });
  }

  delete() {
    const _returnType7 = t.return(t.void());

    return this.store.deleteByKey(this.key).then(function (_arg3) {
      return _returnType7.assert(_arg3);
    });
  }

  async forEachKeys(callback) {
    let _callbackType = t.function();

    const _returnType = t.return(t.union(t.void(), t.ref('Promise', t.void())));

    t.param('callback', _callbackType).assert(callback);

    while (true) {
      const key = await this.next();
      if (!key) return _returnType.assert();

      await callback(key);
    }
  }

  forEach(callback) {
    var _this2 = this;

    const _returnType8 = t.return(t.void());

    return this.forEachKeys(function () {
      return _this2.result().then(function (result) {
        return callback(result);
      });
    }).then(function (_arg4) {
      return _returnType8.assert(_arg4);
    });
  }

  *keysIterator() {
    while (true) {
      yield this.next();
    }
  }

  *[Symbol.iterator]() {
    var _this3 = this;

    // eslint-disable-next-line no-restricted-syntax
    for (const keyPromise of this.keysIterator()) {
      yield keyPromise.then(function (key) {
        return key && _this3.result();
      });
    }
  }

  // TODO Symbol.asyncIterator, https://phabricator.babeljs.io/T7356
  /*
    async *keysAsyncIterator() {
        while (true) {
             const key = await this.next();
             if (!key) return;
              yield key;
        }
     }
      async *[Symbol.asyncIterator] {
        for await (let key of this.keysAsyncIterator()) {
            yield await this.result();
        }
     }
     */
}, _class[t.TypeParametersSymbol] = _AbstractCursorTypeParametersSymbol, _temp);

var _class$1, _temp$1;

const _AbstractStoreTypeParametersSymbol = Symbol('AbstractStoreTypeParameters');

let AbstractStore = (_temp$1 = _class$1 = class {
  /**
   * @param {AbstractConnection} connection
   */
  constructor(connection) {
    this[_AbstractStoreTypeParametersSymbol] = {
      Connection: t.typeParameter('Connection')
    };

    let _connectionType = t.flowInto(this[_AbstractStoreTypeParametersSymbol].Connection);

    t.param('connection', _connectionType).assert(connection);

    assert(connection);
    this._connection = connection;
  }

  get connection() {
    const _returnType = t.return(this[_AbstractStoreTypeParametersSymbol].Connection);

    return _returnType.assert(this._connection);
  }

  findAll(criteria, sort) {
    let _criteriaType = t.nullable(t.object());

    let _sortType = t.nullable(t.object());

    const _returnType2 = t.return(t.array(t.any()));

    t.param('criteria', _criteriaType).assert(criteria);
    t.param('sort', _sortType).assert(sort);

    return this.cursor(criteria, sort).then(function (cursor) {
      return cursor.toArray();
    }).then(function (_arg) {
      return _returnType2.assert(_arg);
    });
  }
}, _class$1[t.TypeParametersSymbol] = _AbstractStoreTypeParametersSymbol, _temp$1);

var _class$2, _temp$2;

const _AbstractQueryTypeParametersSymbol = Symbol('AbstractQueryTypeParameters');

let AbstractQuery = (_temp$2 = _class$2 = class {

  constructor(store, queryCallback) {
    this[_AbstractQueryTypeParametersSymbol] = {
      Store: t.typeParameter('Store', t.ref(AbstractStore))
    };

    this.store = store;
    this.queryCallback = queryCallback;
  }

  fetchAndSubscribe(callback, ...args) {
    let _callbackType = t.function();

    t.param('callback', _callbackType).assert(callback);

    return this._subscribe(callback, true, args);
  }

  subscribe(callback, ...args) {
    let _callbackType2 = t.function();

    t.param('callback', _callbackType2).assert(callback);

    return this._subscribe(callback, false, args);
  }
}, _class$2[t.TypeParametersSymbol] = _AbstractQueryTypeParametersSymbol, _temp$2);

export { AbstractConnection, AbstractCursor, AbstractQuery, AbstractStore, InsertType, UpdateType, ResultType, CursorInterfaceType, StoreInterfaceType };
//# sourceMappingURL=index-browsermodern-dev.es.js.map
