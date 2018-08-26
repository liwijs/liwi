class RestCursor {
  constructor(restResource, connectedUser, cursor) {
    this.restResource = void 0;
    this.connectedUser = void 0;
    this.cursor = void 0;
    this.restResource = restResource;
    this.connectedUser = connectedUser;
    this.cursor = cursor;
  }

  toArray() {
    return this.cursor.toArray().then(results => results && results.map(result => this.restResource.transform(result, this.connectedUser)));
  }

}

class RestService {
  constructor(restResources) {
    this.restResources = void 0;
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

  async createCursor(restResource, connectedUser, {
    criteria,
    sort,
    limit
  }) {
    // TODO: restResource.query(connectedUser, criteria || {}, sort).cursor()
    criteria = restResource.criteria(connectedUser, criteria || {});
    sort = restResource.sort(connectedUser, sort);
    const cursor = await restResource.store.cursor(criteria, sort);
    limit = restResource.limit(limit);
    if (limit) cursor.limit(connectedUser, limit);
    return new RestCursor(restResource, connectedUser, cursor);
  }

}

export { RestService };
//# sourceMappingURL=index-node8.es.js.map
