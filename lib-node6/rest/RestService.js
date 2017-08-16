'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _RestCursor = require('./RestCursor');

var _RestCursor2 = _interopRequireDefault(_RestCursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { return void reject(error); } return info.done ? void resolve(value) : Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } return step("next"); }); }; }

let RestService = class {
  constructor(restResources) {
    this.restResources = restResources;
  }

  addRestResource(key, restResource) {
    this.restResources.set(key, restResource);
  }

  get(key) {
    const restResource = this.restResources.get(key);
    if (!restResource) throw new Error(`Invalid rest resource: "${key}"`);
    return restResource;
  }

  createCursor(restResource, connectedUser, { criteria, sort, limit }) {
    return _asyncToGenerator(function* () {
      criteria = restResource.criteria(connectedUser, criteria || {}), sort = restResource.sort(connectedUser, sort);

      const cursor = yield restResource.store.cursor(criteria, sort);

      return limit = restResource.limit(limit), limit && cursor.limit(connectedUser, limit), new _RestCursor2.default(restResource, connectedUser, cursor);
    })();
  }
};
exports.default = RestService;
//# sourceMappingURL=RestService.js.map