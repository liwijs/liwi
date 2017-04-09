'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _RestCursor = require('./RestCursor');

var _RestCursor2 = _interopRequireDefault(_RestCursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  async createCursor(restResource, connectedUser, { criteria, sort, limit }) {
    // TODO: restResource.query(connectedUser, criteria || {}, sort).cursor()
    criteria = restResource.criteria(connectedUser, criteria || {});
    sort = restResource.sort(connectedUser, sort);
    const cursor = await restResource.store.cursor(criteria, sort);
    limit = restResource.limit(limit);
    if (limit) cursor.limit(connectedUser, limit);
    return new _RestCursor2.default(restResource, connectedUser, cursor);
  }
};
exports.default = RestService;
//# sourceMappingURL=RestService.js.map