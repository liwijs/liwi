import RestCursor from './RestCursor';

export default class RestService {
  constructor(restResources: Map) {
    this.restResources = restResources;
  }

  addRestResource(key: string, restResource) {
    this.restResources.set(key, restResource);
  }

  get(key: string) {
    const restResource = this.restResources.get(key);
    if (!restResource) throw new Error(`Invalid rest resource: "${key}"`);
    return restResource;
  }

  async createCursor(
        restName: string,
        connectedUser: ?Object,
        { criteria, sort, limit }: { criteria: ?Object, sort: ?Object, limit: ?number },
    ): Promise {
    const restResource = this.get(restName);
    criteria = restResource.criteria(connectedUser, criteria || {});
    sort = restResource.sort(connectedUser, sort);
    const cursor = await restResource.store.cursor(criteria, sort);
    limit = restResource.limit(limit);
    if (limit) cursor.limit(connectedUser, limit);
    return new RestCursor(restResource, connectedUser, cursor);
  }
}
