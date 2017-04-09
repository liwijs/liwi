var _dec, _desc, _value, _class, _descriptor, _class2, _temp;

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

/* eslint-disable no-await-in-loop */
import { ResultType as _ResultType } from '../types';

import t from 'flow-runtime';
const ResultType = t.tdz(() => _ResultType);

const _AbstractCursorTypeParametersSymbol = Symbol('AbstractCursorTypeParameters');

let AbstractCursor = (_dec = t.decorate(t.any()), (_class = (_temp = _class2 = class {

  constructor(store) {
    _initDefineProp(this, 'key', _descriptor, this);

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
    const _returnType4 = t.return(t.any());

    return this.next().then(() => this.result()).then(_arg => _returnType4.assert(_arg));
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
    const _returnType6 = t.return(t.ref(ResultType));

    return this.store.findByKey(this.key).then(_arg2 => _returnType6.assert(_arg2));
  }

  delete() {
    const _returnType7 = t.return(t.void());

    return this.store.deleteByKey(this.key).then(_arg3 => _returnType7.assert(_arg3));
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
    const _returnType8 = t.return(t.void());

    return this.forEachKeys(() => this.result().then(result => callback(result))).then(_arg4 => _returnType8.assert(_arg4));
  }

  *keysIterator() {
    while (true) {
      yield this.next();
    }
  }

  *[Symbol.iterator]() {
    // eslint-disable-next-line no-restricted-syntax
    for (let keyPromise of this.keysIterator()) {
      yield keyPromise.then(key => key && this.result());
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
}, _class2[t.TypeParametersSymbol] = _AbstractCursorTypeParametersSymbol, _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'key', [_dec], {
  enumerable: true,
  initializer: null
})), _class));
export { AbstractCursor as default };
//# sourceMappingURL=AbstractCursor.js.map