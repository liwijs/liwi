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

  criteria() {
    return {};
  }

  sort() {
    return null;
  }

  transform(result) {
    return result;
  }
}
exports.default = RestResourceService;
//# sourceMappingURL=RestResource.js.map