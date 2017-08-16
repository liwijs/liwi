'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _class, _temp;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _AbstractStoreTypeParametersSymbol = Symbol('AbstractStoreTypeParameters');

let AbstractStore = (_temp = _class = class {
  /**
     * @param {AbstractConnection} connection
     */
  constructor(connection) {
    this[_AbstractStoreTypeParametersSymbol] = {
      Connection: _flowRuntime2.default.typeParameter('Connection')
    };

    let _connectionType = _flowRuntime2.default.flowInto(this[_AbstractStoreTypeParametersSymbol].Connection);

    _flowRuntime2.default.param('connection', _connectionType).assert(connection), (0, _assert2.default)(connection), this._connection = connection;
  }

  get connection() {
    const _returnType = _flowRuntime2.default.return(this[_AbstractStoreTypeParametersSymbol].Connection);

    return _returnType.assert(this._connection);
  }

  findAll(criteria, sort) {
    let _criteriaType = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

    let _sortType = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

    const _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.array(_flowRuntime2.default.any()));

    return _flowRuntime2.default.param('criteria', _criteriaType).assert(criteria), _flowRuntime2.default.param('sort', _sortType).assert(sort), this.cursor(criteria, sort).then(cursor => cursor.toArray()).then(_arg => _returnType2.assert(_arg));
  }
}, _class[_flowRuntime2.default.TypeParametersSymbol] = _AbstractStoreTypeParametersSymbol, _temp);
exports.default = AbstractStore;
//# sourceMappingURL=AbstractStore.js.map