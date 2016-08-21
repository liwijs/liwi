export default class RestResourceService {
  constructor(store) {
    this.store = store;
  }

  limit(connectedUser: ?Object, limit) {
    return limit;
  }

  criteria(connectedUser: ?Object, criteria: Object) {
    return {};
  }

  sort(connectedUser: ?Object, sort: ?Object) {
    return null;
  }

  transform(result: Object) {
    return result;
  }
}
