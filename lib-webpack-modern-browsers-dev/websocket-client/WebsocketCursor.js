import _t from 'tcomb-forked';
import WebsocketStore from './WebsocketStore';
import AbstractCursor from '../store/AbstractCursor';

export default class WebsocketCursor extends AbstractCursor {

  constructor(store, options) {
    _assert(store, WebsocketStore, 'store');

    super(store);
    this._options = options;
  }

  /* options */

  limit(newLimit) {
    _assert(newLimit, _t.Number, 'newLimit');

    return _assert(function () {
      if (this._idCursor) throw new Error('Cursor already created');
      this._options.limit = newLimit;
      return Promise.resolve(this);
    }.apply(this, arguments), _t.Promise, 'return value');
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
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  advance(count) {
    _assert(count, _t.Number, 'count');

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
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  result() {
    return _assert(function () {
      return Promise.resolve(this._result);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  count() {
    var applyLimit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _assert(applyLimit, _t.Boolean, 'applyLimit');

    return this.emit('count', applyLimit);
  }

  close() {
    return _assert(function () {
      if (!this._store) return Promise.resolve();

      var closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
      this._idCursor = this._options = null;
      this._store = this._result = undefined;
      return closedPromise;
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  toArray() {
    return _assert(function () {
      return this.store.emit('cursor toArray', this._options).then(result => {
        this.close();
        return result;
      });
    }.apply(this, arguments), _t.Promise, 'return value');
  }
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=WebsocketCursor.js.map