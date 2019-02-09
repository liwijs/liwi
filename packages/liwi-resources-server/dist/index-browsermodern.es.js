class ResourceServerCursor {
  constructor(resource, cursor, connectedUser) {
    this.resource = resource;
    this.connectedUser = connectedUser;
    this.cursor = cursor;
  }

  toArray() {
    var _this = this;

    return this.cursor.toArray().then(function (results) {
      return results.map(function (result) {
        return _this.resource.transform(result, _this.connectedUser);
      });
    });
  }

}

class ResourcesServerService {
  constructor({
    serviceResources = new Map(),
    cursorResources = new Map()
  }) {
    this.serviceResources = serviceResources;
    this.cursorResources = cursorResources;
  }

  addResource(key, resource) {
    this.serviceResources.set(key, resource);
  }

  addCursorResource(key, cursorResource) {
    this.cursorResources.set(key, cursorResource);
  }

  getServiceResource(key) {
    const resource = this.serviceResources.get(key);
    if (!resource) throw new Error(`Invalid service resource: "${key}"`);
    return resource;
  }

  getCursorResource(key) {
    const resource = this.cursorResources.get(key);
    if (!resource) throw new Error(`Invalid cursor resource: "${key}"`);
    return resource;
  }

  async createCursor(resource, connectedUser, {
    criteria,
    sort,
    limit
  }) {
    // TODO: resource.query(connectedUser, criteria || {}, sort).cursor()
    criteria = resource.criteria(connectedUser, criteria || {});
    sort = resource.sort(connectedUser, sort);
    const cursor = await resource.store.cursor(criteria, sort);
    limit = resource.limit(limit);
    if (limit) cursor.limit(connectedUser, limit);
    return new ResourceServerCursor(resource, cursor, connectedUser);
  }

}

export { ResourcesServerService };
//# sourceMappingURL=index-browsermodern.es.js.map
