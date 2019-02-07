'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class ResourceServerCursor {
  constructor(resource, cursor, connectedUser) {
    this.resource = resource;
    this.connectedUser = connectedUser;
    this.cursor = cursor;
  }

  toArray() {
    return this.cursor.toArray().then(results => results.map(result => this.resource.transform(result, this.connectedUser)));
  }

}

class ResourcesServerService {
  constructor(serviceResources, cursorResources) {
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

exports.ResourcesServerService = ResourcesServerService;
//# sourceMappingURL=index-node8-dev.cjs.js.map
