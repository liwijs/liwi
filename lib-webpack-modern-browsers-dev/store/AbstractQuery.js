import _t from 'tcomb-forked'; // eslint-disable-next-line no-unused-vars

export default class AbstractQuery {

  constructor(store, queryCallback) {
    this.store = store;
    this.queryCallback = queryCallback;
  }

  fetchAndSubscribe(callback, ...args) {
    _assert(callback, _t.Function, 'callback');

    return this._subscribe(callback, true, args);
  }

  subscribe(callback, ...args) {
    _assert(callback, _t.Function, 'callback');

    return this._subscribe(callback, false, args);
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
//# sourceMappingURL=AbstractQuery.js.map