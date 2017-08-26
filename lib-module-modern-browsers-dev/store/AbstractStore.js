var _class, _temp;

import assert from 'assert';

import t from 'flow-runtime';

const _AbstractStoreTypeParametersSymbol = Symbol('AbstractStoreTypeParameters');

let AbstractStore = (_temp = _class = class {
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
}, _class[t.TypeParametersSymbol] = _AbstractStoreTypeParametersSymbol, _temp);
export { AbstractStore as default };
//# sourceMappingURL=AbstractStore.js.map