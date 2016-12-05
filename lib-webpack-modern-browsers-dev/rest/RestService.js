import _t from 'tcomb-forked';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import RestCursor from './RestCursor';

export default class RestService {
  constructor(restResources) {
    _assert(restResources, Map, 'restResources');

    this.restResources = restResources;
  }

  addRestResource(key, restResource) {
    _assert(key, _t.String, 'key');

    this.restResources.set(key, restResource);
  }

  get(key) {
    _assert(key, _t.String, 'key');

    var restResource = this.restResources.get(key);
    if (!restResource) throw new Error(`Invalid rest resource: "${ key }"`);
    return restResource;
  }

  createCursor(restResource, connectedUser, { criteria, sort, limit }) {
    _assert(connectedUser, _t.maybe(_t.Object), 'connectedUser');

    _assert({
      criteria,
      sort,
      limit
    }, _t.interface({
      criteria: _t.maybe(_t.Object),
      sort: _t.maybe(_t.Object),
      limit: _t.maybe(_t.Number)
    }), '{ criteria, sort, limit }');

    return _assert(_asyncToGenerator(function* () {
      criteria = restResource.criteria(connectedUser, criteria || {});
      sort = restResource.sort(connectedUser, sort);
      var cursor = yield restResource.store.cursor(criteria, sort);
      limit = restResource.limit(limit);
      if (limit) cursor.limit(connectedUser, limit);
      return new RestCursor(restResource, connectedUser, cursor);
    }).apply(this, arguments), _t.Promise, 'return value');
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
//# sourceMappingURL=RestService.js.map