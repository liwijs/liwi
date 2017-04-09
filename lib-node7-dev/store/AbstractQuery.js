'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _dec, _dec2, _desc, _value, _class, _descriptor, _descriptor2, _class2, _temp; // eslint-disable-next-line no-unused-vars


var _AbstractStore = require('./AbstractStore');

var _AbstractStore2 = _interopRequireDefault(_AbstractStore);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['keys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['defineProperty'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper() {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

const _AbstractQueryTypeParametersSymbol = Symbol('AbstractQueryTypeParameters');

let AbstractQuery = (_dec = _flowRuntime2.default.decorate(function () {
  return _flowRuntime2.default.flowInto(this[_AbstractQueryTypeParametersSymbol].Store);
}), _dec2 = _flowRuntime2.default.decorate(_flowRuntime2.default.function()), (_class = (_temp = _class2 = class {

  constructor(store, queryCallback) {
    _initDefineProp(this, 'store', _descriptor, this);

    _initDefineProp(this, 'queryCallback', _descriptor2, this);

    this[_AbstractQueryTypeParametersSymbol] = {
      Store: _flowRuntime2.default.typeParameter('Store', _flowRuntime2.default.ref(_AbstractStore2.default))
    };

    this.store = store;
    this.queryCallback = queryCallback;
  }

  fetchAndSubscribe(callback, ...args) {
    let _callbackType = _flowRuntime2.default.function();

    _flowRuntime2.default.param('callback', _callbackType).assert(callback);

    return this._subscribe(callback, true, args);
  }

  subscribe(callback, ...args) {
    let _callbackType2 = _flowRuntime2.default.function();

    _flowRuntime2.default.param('callback', _callbackType2).assert(callback);

    return this._subscribe(callback, false, args);
  }
}, _class2[_flowRuntime2.default.TypeParametersSymbol] = _AbstractQueryTypeParametersSymbol, _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'store', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'queryCallback', [_dec2], {
  enumerable: true,
  initializer: null
})), _class));
exports.default = AbstractQuery;
//# sourceMappingURL=AbstractQuery.js.map