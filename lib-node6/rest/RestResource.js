"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class RestResourceService {
  constructor(store) {
    this.store = store;
  }

  limit(connectedUser, limit) {
    return limit;
  }

  criteria(connectedUser, criteria) {
    return {};
  }

  sort(connectedUser, sort) {
    return null;
  }

  transform(result) {
    return result;
  }
}
exports.default = RestResourceService;
//# sourceMappingURL=RestResource.js.map