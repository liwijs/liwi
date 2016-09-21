'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _WebsocketStore = require('./WebsocketStore');

var _WebsocketStore2 = _interopRequireDefault(_WebsocketStore);

var _AbstractCursor = require('../store/AbstractCursor');

var _AbstractCursor2 = _interopRequireDefault(_AbstractCursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class WebsocketCursor extends _AbstractCursor2.default {

  constructor(store, options) {
    _assert(store, _WebsocketStore2.default, 'store');

    super(store);
    this._options = options;
  }

  /* options */

  limit(newLimit) {
    _assert(newLimit, _tcombForked2.default.Number, 'newLimit');

    return _assert(function () {
      if (this._idCursor) throw new Error('Cursor already created');
      this._options.limit = newLimit;
      return Promise.resolve(this);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  /* results */

  _create() {
    if (this._idCursor) throw new Error('Cursor already created');
    return this.store.connection.emit('createCursor', this._options).then(idCursor => {
      if (!idCursor) return;
      this._idCursor = idCursor;
    });
  }

  emit(type) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return _assert(function () {
      if (!this._idCursor) {
        return this._create().then(() => this.emit(type, ...args));
      }

      return this.store.emit('cursor', { type, id: this._idCursor }, args);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  advance(count) {
    _assert(count, _tcombForked2.default.Number, 'count');

    this.emit('advance', count);
    return this;
  }

  next() {
    return _assert(function () {
      return this.emit('next').then(result => {
        this._result = result;
        this.key = result && result[this._store.keyPath];
        return this.key;
      });
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  result() {
    return _assert(function () {
      return Promise.resolve(this._result);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  count() {
    let applyLimit = _assert(arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0], _tcombForked2.default.Boolean, 'applyLimit');

    _assert(applyLimit, _tcombForked2.default.Boolean, 'applyLimit');

    return this.emit('count', applyLimit);
  }

  close() {
    return _assert(function () {
      if (!this._store) return Promise.resolve();

      const closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
      this._idCursor = this._options = null;
      this._store = this._result = undefined;
      return closedPromise;
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  toArray() {
    return _assert(function () {
      return this.store.emit('cursor toArray', this._options).then(result => {
        this.close();
        return result;
      });
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }
}
exports.default = WebsocketCursor;

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }

    return type(x);
  }

  if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=WebsocketCursor.js.map