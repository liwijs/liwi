import RestCursor from './RestCursor';

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
    criteria = restResource.criteria(connectedUser, criteria || {}), sort = restResource.sort(connectedUser, sort);

    const cursor = await restResource.store.cursor(criteria, sort);

    return limit = restResource.limit(limit), limit && cursor.limit(connectedUser, limit), new RestCursor(restResource, connectedUser, cursor);
  }
};
export { RestService as default };
//# sourceMappingURL=RestService.js.map