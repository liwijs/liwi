'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _AbstractCursor = require('../store/AbstractCursor');

var _AbstractCursor2 = _interopRequireDefault(_AbstractCursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let WebsocketCursor = class extends _AbstractCursor2.default {

  constructor(store, options) {
    super(store);
    this._options = options;
  }

  /* options */

  limit(newLimit) {
    if (this._idCursor) throw new Error('Cursor already created');
    this._options.limit = newLimit;
    return Promise.resolve(this);
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
    if (!this._idCursor) {
      return this._create().then(() => this.emit(type, ...args));
    }

    return this.store.emit('cursor', { type, id: this._idCursor }, args);
  }

  advance(count) {
    this.emit('advance', count);
    return this;
  }

  next() {
    return this.emit('next').then(result => {
      this._result = result;
      this.key = result && result[this._store.keyPath];
      return this.key;
    });
  }

  result() {
    return Promise.resolve(this._result);
  }

  count(applyLimit = false) {
    return this.emit('count', applyLimit);
  }

  close() {
    if (!this._store) return Promise.resolve();

    const closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
    this._idCursor = null;
    this._options = null;
    this._store = undefined;
    this._result = undefined;
    return closedPromise;
  }

  toArray() {
    return this.store.emit('cursor toArray', this._options).then(result => {
      this.close();
      return result;
    });
  }
};
exports.default = WebsocketCursor;
//# sourceMappingURL=WebsocketCursor.js.map