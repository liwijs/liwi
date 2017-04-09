
import AbstractCursor from '../store/AbstractCursor';
let WebsocketCursor = class extends AbstractCursor {

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
    var _this = this;

    if (this._idCursor) throw new Error('Cursor already created');
    return this.store.connection.emit('createCursor', this._options).then(function (idCursor) {
      if (!idCursor) return;
      _this._idCursor = idCursor;
    });
  }

  emit(type, ...args) {
    var _this2 = this;

    if (!this._idCursor) {
      return this._create().then(function () {
        return _this2.emit(type, ...args);
      });
    }

    return this.store.emit('cursor', { type, id: this._idCursor }, args);
  }

  advance(count) {
    this.emit('advance', count);
    return this;
  }

  next() {
    var _this3 = this;

    return this.emit('next').then(function (result) {
      _this3._result = result;
      _this3.key = result && result[_this3._store.keyPath];
      return _this3.key;
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
    var _this4 = this;

    return this.store.emit('cursor toArray', this._options).then(function (result) {
      _this4.close();
      return result;
    });
  }
};
export { WebsocketCursor as default };
//# sourceMappingURL=WebsocketCursor.js.map