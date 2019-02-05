import { BaseModel, Criteria, Sort } from 'liwi-types';
import ResourceServerCursor from './ResourceServerCursor';
import Resource from './Resource';

export interface CreateCursorOptions<Model extends BaseModel> {
  criteria?: Criteria<Model>;
  sort?: Sort<Model>;
  limit?: number;
}

export default class ResourcesServerService {
  resources: Map<string, Resource<any, any, any>>;

  constructor(resources: Map<string, Resource<any, any, any>>) {
    this.resources = resources;
  }

  addResource(key: string, resource: Resource<any, any, any>) {
    this.resources.set(key, resource);
  }

  get(key: string) {
    const resource = this.resources.get(key);
    if (!resource) throw new Error(`Invalid rest resource: "${key}"`);
    return resource;
  }

  async createCursor<Model extends BaseModel, Transformed, ConnectedUser>(
    resource: Resource<Model, Transformed, ConnectedUser>,
    connectedUser: any,
    { criteria, sort, limit }: CreateCursorOptions<Model>,
  ): Promise<ResourceServerCursor<Model, Transformed, ConnectedUser>> {
    // TODO: resource.query(connectedUser, criteria || {}, sort).cursor()
    criteria = resource.criteria(connectedUser, criteria || {});
    sort = resource.sort(connectedUser, sort);
    const cursor = await resource.store.cursor(criteria, sort);
    limit = resource.limit(limit);
    if (limit) cursor.limit(connectedUser, limit);
    return new ResourceServerCursor(resource, connectedUser, cursor);
  }
}
