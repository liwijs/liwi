import _t from "tcomb-forked";
export default class RestResourceService {
  constructor(store) {
    this.store = store;
  }

  limit(connectedUser, limit) {
    _assert(connectedUser, _t.maybe(_t.Object), "connectedUser");

    return limit;
  }

  criteria() {
    return {};
  }

  sort() {
    return null;
  }

  transform(result) {
    _assert(result, _t.Object, "result");

    return result;
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
//# sourceMappingURL=RestResource.js.map