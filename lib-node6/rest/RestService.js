'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _RestCursor = require('./RestCursor');

var _RestCursor2 = _interopRequireDefault(_RestCursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class RestService {
  constructor(restResources) {
    this.restResources = restResources;
  }

  addRestResource(key, restResource) {
    this.restResources.set(key, restResource);
  }

  get(key) {
    const restResource = this.restResources.get(key);
    if (!restResource) throw new Error(`Invalid rest resource: "${ key }"`);
    return restResource;
  }

  createCursor(restName, connectedUser, _ref) {
    var _this = this;

    let criteria = _ref.criteria;
    let sort = _ref.sort;
    let limit = _ref.limit;
    return _asyncToGenerator(function* () {
      const restResource = _this.get(restName);
      criteria = restResource.criteria(connectedUser, criteria || {});
      sort = restResource.sort(connectedUser, sort);
      const cursor = yield restResource.store.cursor(criteria, sort);
      limit = restResource.limit(limit);
      if (limit) cursor.limit(connectedUser, limit);
      return new _RestCursor2.default(restResource, connectedUser, cursor);
    })();
  }
}
exports.default = RestService;
//# sourceMappingURL=RestService.js.map