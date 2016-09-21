import _t from 'tcomb-forked';
import EventEmitter from 'events';
// import type { StoreInterface } from '../types';

export default class AbstractManager extends EventEmitter {

  constructor(store) {
    _assert(store, _t.Any, 'store');

    super();
    this._store = store;
  }

  get store() {
    return _assert(function () {
      return this._store;
    }.apply(this, arguments), _t.Any, 'return value');
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

    return type(x);
  }

  if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=AbstractManager.js.map