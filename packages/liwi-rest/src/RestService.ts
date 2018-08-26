import { Criteria, Sort } from 'liwi-types';
import RestCursor from './RestCursor';

export interface CreateCursorOptions<Model> {
  criteria?: Criteria<Model>;
  sort?: Sort<Model>;
  limit?: number;
}

export default class RestService {
  restResources: Map<string, any>;

  constructor(restResources: Map<string, any>) {
    this.restResources = restResources;
  }

  addRestResource(key: string, restResource: any) {
    this.restResources.set(key, restResource);
  }

  get(key: string) {
    const restResource = this.restResources.get(key);
    if (!restResource) throw new Error(`Invalid rest resource: "${key}"`);
    return restResource;
  }

  async createCursor<Model, R extends any>(
    restResource: R,
    connectedUser: any,
    { criteria, sort, limit }: CreateCursorOptions<Model>,
  ): Promise<RestCursor<R>> {
    // TODO: restResource.query(connectedUser, criteria || {}, sort).cursor()
    criteria = restResource.criteria(connectedUser, criteria || {});
    sort = restResource.sort(connectedUser, sort);
    const cursor = await restResource.store.cursor(criteria, sort);
    limit = restResource.limit(limit);
    if (limit) cursor.limit(connectedUser, limit);
    return new RestCursor(restResource, connectedUser, cursor);
  }
}
