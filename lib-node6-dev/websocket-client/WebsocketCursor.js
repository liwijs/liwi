'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _WebsocketStore = require('./WebsocketStore');

var _WebsocketStore2 = _interopRequireDefault(_WebsocketStore);

var _AbstractCursor = require('../store/AbstractCursor');

var _AbstractCursor2 = _interopRequireDefault(_AbstractCursor);

var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ResultType = _flowRuntime2.default.tdz(() => _types.ResultType);

let WebsocketCursor = class extends _AbstractCursor2.default {

  constructor(store, options) {
    let _storeType = _flowRuntime2.default.ref(_WebsocketStore2.default);

    _flowRuntime2.default.param('store', _storeType).assert(store), super(store), _flowRuntime2.default.bindTypeParameters(this, _flowRuntime2.default.ref(_WebsocketStore2.default)), this._options = options;
  }

  /* options */

  limit(newLimit) {
    let _newLimitType = _flowRuntime2.default.number();

    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.this(this));

    if (_flowRuntime2.default.param('newLimit', _newLimitType).assert(newLimit), this._idCursor) throw new Error('Cursor already created');

    return this._options.limit = newLimit, Promise.resolve(this).then(_arg => _returnType.assert(_arg));
  }

  /* results */

  _create() {
    if (this._idCursor) throw new Error('Cursor already created');
    return this.store.connection.emit('createCursor', this._options).then(idCursor => {
      idCursor && (this._idCursor = idCursor);
    });
  }

  emit(type, ...args) {
    const _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.any());

    return this._idCursor ? this.store.emit('cursor', { type, id: this._idCursor }, args).then(_arg3 => _returnType2.assert(_arg3)) : this._create().then(() => this.emit(type, ...args)).then(_arg2 => _returnType2.assert(_arg2));
  }

  advance(count) {
    let _countType = _flowRuntime2.default.number();

    return _flowRuntime2.default.param('count', _countType).assert(count), this.emit('advance', count), this;
  }

  next() {
    const _returnType3 = _flowRuntime2.default.return(_flowRuntime2.default.nullable(_flowRuntime2.default.any()));

    return this.emit('next').then(result => (this._result = result, this.key = result && result[this._store.keyPath], this.key)).then(_arg4 => _returnType3.assert(_arg4));
  }

  result() {
    const _returnType4 = _flowRuntime2.default.return(_flowRuntime2.default.nullable(_flowRuntime2.default.ref(ResultType)));

    return Promise.resolve(this._result).then(_arg5 => _returnType4.assert(_arg5));
  }

  count(applyLimit = false) {
    let _applyLimitType = _flowRuntime2.default.boolean();

    return _flowRuntime2.default.param('applyLimit', _applyLimitType).assert(applyLimit), this.emit('count', applyLimit);
  }

  close() {
    const _returnType5 = _flowRuntime2.default.return(_flowRuntime2.default.void());

    if (!this._store) return Promise.resolve().then(_arg6 => _returnType5.assert(_arg6));

    const closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();

    return this._idCursor = null, this._options = null, this._store = void 0, this._result = void 0, closedPromise.then(_arg7 => _returnType5.assert(_arg7));
  }

  toArray() {
    const _returnType6 = _flowRuntime2.default.return(_flowRuntime2.default.array(_flowRuntime2.default.array(_flowRuntime2.default.ref(ResultType))));

    return this.store.emit('cursor toArray', this._options).then(result => (this.close(), result)).then(_arg8 => _returnType6.assert(_arg8));
  }
};
exports.default = WebsocketCursor;
//# sourceMappingURL=WebsocketCursor.js.map