var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import assert from 'assert';

import t from 'flow-runtime';

var _AbstractStoreTypeParametersSymbol = Symbol('AbstractStoreTypeParameters');

var AbstractStore = (_temp = _class = function () {
  /**
     * @param {AbstractConnection} connection
     */
  function AbstractStore(connection) {
    _classCallCheck(this, AbstractStore);

    this[_AbstractStoreTypeParametersSymbol] = {
      Connection: t.typeParameter('Connection')
    };

    var _connectionType = t.flowInto(this[_AbstractStoreTypeParametersSymbol].Connection);

    t.param('connection', _connectionType).assert(connection);

    assert(connection);
    this._connection = connection;
  }

  _createClass(AbstractStore, [{
    key: 'findAll',
    value: function findAll(criteria, sort) {
      var _criteriaType = t.nullable(t.object());

      var _sortType = t.nullable(t.object());

      var _returnType2 = t.return(t.array(t.any()));

      t.param('criteria', _criteriaType).assert(criteria);
      t.param('sort', _sortType).assert(sort);

      return this.cursor(criteria, sort).then(function (cursor) {
        return cursor.toArray();
      }).then(function (_arg) {
        return _returnType2.assert(_arg);
      });
    }
  }, {
    key: 'connection',
    get: function get() {
      var _returnType = t.return(this[_AbstractStoreTypeParametersSymbol].Connection);

      return _returnType.assert(this._connection);
    }
  }]);

  return AbstractStore;
}(), _class[t.TypeParametersSymbol] = _AbstractStoreTypeParametersSymbol, _temp);
export { AbstractStore as default };
//# sourceMappingURL=AbstractStore.js.map