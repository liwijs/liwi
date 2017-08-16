'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _class, _temp; // eslint-disable-next-line no-unused-vars


var _AbstractStore = require('./AbstractStore');

var _AbstractStore2 = _interopRequireDefault(_AbstractStore);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _AbstractQueryTypeParametersSymbol = Symbol('AbstractQueryTypeParameters');

let AbstractQuery = (_temp = _class = class {

  constructor(store, queryCallback) {
    this[_AbstractQueryTypeParametersSymbol] = {
      Store: _flowRuntime2.default.typeParameter('Store', _flowRuntime2.default.ref(_AbstractStore2.default))
    }, this.store = store, this.queryCallback = queryCallback;
  }

  fetchAndSubscribe(callback, ...args) {
    let _callbackType = _flowRuntime2.default.function();

    return _flowRuntime2.default.param('callback', _callbackType).assert(callback), this._subscribe(callback, true, args);
  }

  subscribe(callback, ...args) {
    let _callbackType2 = _flowRuntime2.default.function();

    return _flowRuntime2.default.param('callback', _callbackType2).assert(callback), this._subscribe(callback, false, args);
  }
}, _class[_flowRuntime2.default.TypeParametersSymbol] = _AbstractQueryTypeParametersSymbol, _temp);
exports.default = AbstractQuery;
//# sourceMappingURL=AbstractQuery.js.map