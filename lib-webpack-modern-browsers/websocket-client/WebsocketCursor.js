import WebsocketStore from './WebsocketStore';
import AbstractCursor from '../store/AbstractCursor';

export default class WebsocketCursor extends AbstractCursor {

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
    var applyLimit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    return this.emit('count', applyLimit);
  }

  close() {
    if (!this._store) return Promise.resolve();

    var closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
    this._idCursor = this._options = null;
    this._store = this._result = undefined;
    return closedPromise;
  }

  toArray() {
    return this.store.emit('cursor toArray', this._options).then(result => {
      this.close();
      return result;
    });
  }
}
//# sourceMappingURL=WebsocketCursor.js.map