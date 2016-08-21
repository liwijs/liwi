function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

import RestCursor from './RestCursor';

export default class RestService {
  constructor(restResources) {
    this.restResources = restResources;
  }

  addRestResource(key, restResource) {
    this.restResources.set(key, restResource);
  }

  get(key) {
    var restResource = this.restResources.get(key);
    if (!restResource) throw new Error(`Invalid rest resource: "${ key }"`);
    return restResource;
  }

  createCursor(restName, connectedUser, _ref) {
    var _this = this;

    var criteria = _ref.criteria;
    var sort = _ref.sort;
    var limit = _ref.limit;
    return _asyncToGenerator(function* () {
      var restResource = _this.get(restName);
      criteria = restResource.criteria(connectedUser, criteria || {});
      sort = restResource.sort(connectedUser, sort);
      var cursor = yield restResource.store.cursor(criteria, sort);
      limit = restResource.limit(limit);
      if (limit) cursor.limit(connectedUser, limit);
      return new RestCursor(restResource, connectedUser, cursor);
    })();
  }
}
//# sourceMappingURL=RestService.js.map