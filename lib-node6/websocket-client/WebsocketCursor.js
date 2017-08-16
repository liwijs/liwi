'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractCursor = require('../store/AbstractCursor');

var _AbstractCursor2 = _interopRequireDefault(_AbstractCursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let WebsocketCursor = class extends _AbstractCursor2.default {

  constructor(store, options) {
    super(store), this._options = options;
  }

  /* options */

  limit(newLimit) {
    if (this._idCursor) throw new Error('Cursor already created');

    return this._options.limit = newLimit, Promise.resolve(this);
  }

  /* results */

  _create() {
    if (this._idCursor) throw new Error('Cursor already created');
    return this.store.connection.emit('createCursor', this._options).then(idCursor => {
      idCursor && (this._idCursor = idCursor);
    });
  }

  emit(type, ...args) {
    return this._idCursor ? this.store.emit('cursor', { type, id: this._idCursor }, args) : this._create().then(() => this.emit(type, ...args));
  }

  advance(count) {
    return this.emit('advance', count), this;
  }

  next() {
    return this.emit('next').then(result => (this._result = result, this.key = result && result[this._store.keyPath], this.key));
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

    return this._idCursor = null, this._options = null, this._store = void 0, this._result = void 0, closedPromise;
  }

  toArray() {
    return this.store.emit('cursor toArray', this._options).then(result => (this.close(), result));
  }
};
exports.default = WebsocketCursor;
//# sourceMappingURL=WebsocketCursor.js.map