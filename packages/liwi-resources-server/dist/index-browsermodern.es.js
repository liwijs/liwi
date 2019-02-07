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
  constructor(resources) {
    this.resources = resources;
  }

  addResource(key, resource) {
    this.resources.set(key, resource);
  }

  get(key) {
    const resource = this.resources.get(key);
    if (!resource) throw new Error(`Invalid rest resource: "${key}"`);
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
