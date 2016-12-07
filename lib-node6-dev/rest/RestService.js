'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _RestCursor = require('./RestCursor');

var _RestCursor2 = _interopRequireDefault(_RestCursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class RestService {
  constructor(restResources) {
    _assert(restResources, Map, 'restResources');

    this.restResources = restResources;
  }

  addRestResource(key, restResource) {
    _assert(key, _tcombForked2.default.String, 'key');

    this.restResources.set(key, restResource);
  }

  get(key) {
    _assert(key, _tcombForked2.default.String, 'key');

    const restResource = this.restResources.get(key);
    if (!restResource) throw new Error(`Invalid rest resource: "${ key }"`);
    return restResource;
  }

  createCursor(restResource, connectedUser, { criteria, sort, limit }) {
    _assert(connectedUser, _tcombForked2.default.maybe(_tcombForked2.default.Object), 'connectedUser');

    _assert({
      criteria,
      sort,
      limit
    }, _tcombForked2.default.interface({
      criteria: _tcombForked2.default.maybe(_tcombForked2.default.Object),
      sort: _tcombForked2.default.maybe(_tcombForked2.default.Object),
      limit: _tcombForked2.default.maybe(_tcombForked2.default.Number)
    }), '{ criteria, sort, limit }');

    return _assert(_asyncToGenerator(function* () {
      // TODO: restResource.query(connectedUser, criteria || {}, sort).cursor()
      criteria = restResource.criteria(connectedUser, criteria || {});
      sort = restResource.sort(connectedUser, sort);
      const cursor = yield restResource.store.cursor(criteria, sort);
      limit = restResource.limit(limit);
      if (limit) cursor.limit(connectedUser, limit);
      return new _RestCursor2.default(restResource, connectedUser, cursor);
    }).apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }
}
exports.default = RestService;

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=RestService.js.map