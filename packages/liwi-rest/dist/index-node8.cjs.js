'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

let RestCursor = class {
  constructor(restResource, connectedUser, cursor) {
    this._restResource = restResource;
    this._connectedUser = connectedUser;
    this._cursor = cursor;
  }

  toArray() {
    return this._cursor.toArray().then(results => results && results.map(result => this._restResource.transform(result, this._connectedUser)));
  }
};

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
    return new RestCursor(restResource, connectedUser, cursor);
  }
};

exports.RestService = RestService;
//# sourceMappingURL=index-node8.cjs.js.map
