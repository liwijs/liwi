'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _WebsocketStore = require('./WebsocketStore');

var _WebsocketStore2 = _interopRequireDefault(_WebsocketStore);

var _AbstractCursor = require('../store/AbstractCursor');

var _AbstractCursor2 = _interopRequireDefault(_AbstractCursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class WebsocketCursor extends _AbstractCursor2.default {

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

  emit(type) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

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

  count() {
    let applyLimit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    return this.emit('count', applyLimit);
  }

  close() {
    if (!this._store) return Promise.resolve();

    const closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
    this._idCursor = this._options = null;
    this._store = this._result = undefined;
    return closedPromise;
  }

  toArray() {
    return this.store.emit('cursor toArray', this._options, result => {
      this.close();
      return result;
    });
  }
}
exports.default = WebsocketCursor;
//# sourceMappingURL=WebsocketCursor.js.map