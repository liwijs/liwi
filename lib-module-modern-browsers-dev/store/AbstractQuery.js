var _dec, _dec2, _desc, _value, _class, _descriptor, _descriptor2, _class2, _temp;

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

// eslint-disable-next-line no-unused-vars
import AbstractStore from './AbstractStore';

import t from 'flow-runtime';

const _AbstractQueryTypeParametersSymbol = Symbol('AbstractQueryTypeParameters');

let AbstractQuery = (_dec = t.decorate(function () {
  return t.flowInto(this[_AbstractQueryTypeParametersSymbol].Store);
}), _dec2 = t.decorate(t.function()), (_class = (_temp = _class2 = class {

  constructor(store, queryCallback) {
    _initDefineProp(this, 'store', _descriptor, this);

    _initDefineProp(this, 'queryCallback', _descriptor2, this);

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
}, _class2[t.TypeParametersSymbol] = _AbstractQueryTypeParametersSymbol, _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'store', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'queryCallback', [_dec2], {
  enumerable: true,
  initializer: null
})), _class));
export { AbstractQuery as default };
//# sourceMappingURL=AbstractQuery.js.map