var _dec, _dec2, _dec3, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3;

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

import WebsocketStore from './WebsocketStore';
import AbstractCursor from '../store/AbstractCursor';
import { ResultType as _ResultType } from '../types';

import t from 'flow-runtime';
const ResultType = t.tdz(() => _ResultType);
let WebsocketCursor = (_dec = t.decorate(t.nullable(t.number())), _dec2 = t.decorate(t.nullable(t.object())), _dec3 = t.decorate(t.nullable(t.object())), (_class = class extends AbstractCursor {

  constructor(store, options) {
    let _storeType = t.ref(WebsocketStore);

    t.param('store', _storeType).assert(store);

    super(store);

    _initDefineProp(this, '_idCursor', _descriptor, this);

    _initDefineProp(this, '_options', _descriptor2, this);

    _initDefineProp(this, '_result', _descriptor3, this);

    t.bindTypeParameters(this, t.ref(WebsocketStore));
    this._options = options;
  }

  /* options */

  limit(newLimit) {
    let _newLimitType = t.number();

    const _returnType = t.return(t.this(this));

    t.param('newLimit', _newLimitType).assert(newLimit);

    if (this._idCursor) throw new Error('Cursor already created');
    this._options.limit = newLimit;
    return Promise.resolve(this).then(_arg => _returnType.assert(_arg));
  }

  /* results */

  _create() {
    if (this._idCursor) throw new Error('Cursor already created');
    return this.store.connection.emit('createCursor', this._options).then(idCursor => {
      if (!idCursor) return;
      this._idCursor = idCursor;
    });
  }

  emit(type, ...args) {
    const _returnType2 = t.return(t.any());

    if (!this._idCursor) {
      return this._create().then(() => this.emit(type, ...args)).then(_arg2 => _returnType2.assert(_arg2));
    }

    return this.store.emit('cursor', { type, id: this._idCursor }, args).then(_arg3 => _returnType2.assert(_arg3));
  }

  advance(count) {
    let _countType = t.number();

    t.param('count', _countType).assert(count);

    this.emit('advance', count);
    return this;
  }

  next() {
    const _returnType3 = t.return(t.nullable(t.any()));

    return this.emit('next').then(result => {
      this._result = result;
      this.key = result && result[this._store.keyPath];
      return this.key;
    }).then(_arg4 => _returnType3.assert(_arg4));
  }

  result() {
    const _returnType4 = t.return(t.nullable(t.ref(ResultType)));

    return Promise.resolve(this._result).then(_arg5 => _returnType4.assert(_arg5));
  }

  count(applyLimit = false) {
    let _applyLimitType = t.boolean();

    t.param('applyLimit', _applyLimitType).assert(applyLimit);

    return this.emit('count', applyLimit);
  }

  close() {
    const _returnType5 = t.return(t.void());

    if (!this._store) return Promise.resolve().then(_arg6 => _returnType5.assert(_arg6));

    const closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
    this._idCursor = null;
    this._options = null;
    this._store = undefined;
    this._result = undefined;
    return closedPromise.then(_arg7 => _returnType5.assert(_arg7));
  }

  toArray() {
    const _returnType6 = t.return(t.array(t.array(t.ref(ResultType))));

    return this.store.emit('cursor toArray', this._options).then(result => {
      this.close();
      return result;
    }).then(_arg8 => _returnType6.assert(_arg8));
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, '_idCursor', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, '_options', [_dec2], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, '_result', [_dec3], {
  enumerable: true,
  initializer: null
})), _class));
export { WebsocketCursor as default };
//# sourceMappingURL=WebsocketCursor.js.map