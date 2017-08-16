import WebsocketStore from './WebsocketStore';
import AbstractCursor from '../store/AbstractCursor';
import { ResultType as _ResultType } from '../types';

import t from 'flow-runtime';
const ResultType = t.tdz(function () {
  return _ResultType;
});
let WebsocketCursor = class extends AbstractCursor {

  constructor(store, options) {
    let _storeType = t.ref(WebsocketStore);

    t.param('store', _storeType).assert(store), super(store), t.bindTypeParameters(this, t.ref(WebsocketStore)), this._options = options;
  }

  /* options */

  limit(newLimit) {
    let _newLimitType = t.number();

    const _returnType = t.return(t.this(this));

    if (t.param('newLimit', _newLimitType).assert(newLimit), this._idCursor) throw new Error('Cursor already created');

    return this._options.limit = newLimit, Promise.resolve(this).then(function (_arg) {
      return _returnType.assert(_arg);
    });
  }

  /* results */

  _create() {
    var _this = this;

    if (this._idCursor) throw new Error('Cursor already created');
    return this.store.connection.emit('createCursor', this._options).then(function (idCursor) {
      idCursor && (_this._idCursor = idCursor);
    });
  }

  emit(type, ...args) {
    var _this2 = this;

    const _returnType2 = t.return(t.any());

    return this._idCursor ? this.store.emit('cursor', { type, id: this._idCursor }, args).then(function (_arg3) {
      return _returnType2.assert(_arg3);
    }) : this._create().then(function () {
      return _this2.emit(type, ...args);
    }).then(function (_arg2) {
      return _returnType2.assert(_arg2);
    });
  }

  advance(count) {
    let _countType = t.number();

    return t.param('count', _countType).assert(count), this.emit('advance', count), this;
  }

  next() {
    var _this3 = this;

    const _returnType3 = t.return(t.nullable(t.any()));

    return this.emit('next').then(function (result) {
      return _this3._result = result, _this3.key = result && result[_this3._store.keyPath], _this3.key;
    }).then(function (_arg4) {
      return _returnType3.assert(_arg4);
    });
  }

  result() {
    const _returnType4 = t.return(t.nullable(t.ref(ResultType)));

    return Promise.resolve(this._result).then(function (_arg5) {
      return _returnType4.assert(_arg5);
    });
  }

  count(applyLimit = false) {
    let _applyLimitType = t.boolean();

    return t.param('applyLimit', _applyLimitType).assert(applyLimit), this.emit('count', applyLimit);
  }

  close() {
    const _returnType5 = t.return(t.void());

    if (!this._store) return Promise.resolve().then(function (_arg6) {
      return _returnType5.assert(_arg6);
    });

    const closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();

    return this._idCursor = null, this._options = null, this._store = void 0, this._result = void 0, closedPromise.then(function (_arg7) {
      return _returnType5.assert(_arg7);
    });
  }

  toArray() {
    var _this4 = this;

    const _returnType6 = t.return(t.array(t.array(t.ref(ResultType))));

    return this.store.emit('cursor toArray', this._options).then(function (result) {
      return _this4.close(), result;
    }).then(function (_arg8) {
      return _returnType6.assert(_arg8);
    });
  }
};
export { WebsocketCursor as default };
//# sourceMappingURL=WebsocketCursor.js.map