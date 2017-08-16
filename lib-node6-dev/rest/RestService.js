'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _RestCursor = require('./RestCursor');

var _RestCursor2 = _interopRequireDefault(_RestCursor);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { return void reject(error); } return info.done ? void resolve(value) : Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } return step("next"); }); }; }

let RestService = class {
  constructor(restResources) {
    let _restResourcesType = _flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.any());

    _flowRuntime2.default.param('restResources', _restResourcesType).assert(restResources), this.restResources = restResources;
  }

  addRestResource(key, restResource) {
    let _keyType = _flowRuntime2.default.string();

    _flowRuntime2.default.param('key', _keyType).assert(key), this.restResources.set(key, restResource);
  }

  get(key) {
    let _keyType2 = _flowRuntime2.default.string();

    _flowRuntime2.default.param('key', _keyType2).assert(key);

    const restResource = this.restResources.get(key);
    if (!restResource) throw new Error(`Invalid rest resource: "${key}"`);
    return restResource;
  }

  createCursor(restResource, connectedUser, _arg) {
    return _asyncToGenerator(function* () {
      let _connectedUserType = _flowRuntime2.default.nullable(_flowRuntime2.default.object());

      const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.mixed());

      _flowRuntime2.default.param('connectedUser', _connectedUserType).assert(connectedUser);

      let { criteria, sort, limit } = _flowRuntime2.default.object(_flowRuntime2.default.property('criteria', _flowRuntime2.default.nullable(_flowRuntime2.default.object())), _flowRuntime2.default.property('sort', _flowRuntime2.default.nullable(_flowRuntime2.default.object())), _flowRuntime2.default.property('limit', _flowRuntime2.default.nullable(_flowRuntime2.default.number()))).assert(_arg);

      criteria = restResource.criteria(connectedUser, criteria || {}), sort = restResource.sort(connectedUser, sort);

      const cursor = yield restResource.store.cursor(criteria, sort);

      return limit = restResource.limit(limit), limit && cursor.limit(connectedUser, limit), _returnType.assert(new _RestCursor2.default(restResource, connectedUser, cursor));
    })();
  }
};
exports.default = RestService;
//# sourceMappingURL=RestService.js.map