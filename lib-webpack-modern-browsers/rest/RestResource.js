export default class RestResourceService {
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
//# sourceMappingURL=RestResource.js.map