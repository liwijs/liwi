'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const liwiResources = require('liwi-resources');

// import ResourceServerCursor from './ResourceServerCursor';
// import { CursorResource } from './CursorResource';
class ResourcesServerService {
  // readonly cursorResources: Map<string, CursorResource<any, any, any>>;
  constructor({
    serviceResources = new Map()
  }) {
    this.serviceResources = serviceResources; // this.cursorResources = cursorResources;
  }

  addResource(key, resource) {
    this.serviceResources.set(key, resource);
  } // addCursorResource(
  //   key: string,
  //   cursorResource: CursorResource<any, any, any>,
  // ) {
  //   this.cursorResources.set(key, cursorResource);
  // }


  getServiceResource(key) {
    const resource = this.serviceResources.get(key);
    if (!resource) throw new Error(`Invalid service resource: "${key}"`);
    return resource;
  } // getCursorResource(key: string) {
  //   const resource = this.cursorResources.get(key);
  //   if (!resource) throw new Error(`Invalid cursor resource: "${key}"`);
  //   return resource;
  // }
  // async createCursor<Model extends BaseModel, Transformed, ConnectedUser>(
  //   resource: CursorResource<Model, Transformed, ConnectedUser>,
  //   connectedUser: ConnectedUser,
  //   { criteria, sort, limit }: CreateCursorOptions<Model>,
  // ): Promise<ResourceServerCursor<Model, any, Transformed, ConnectedUser>> {
  //   // TODO: resource.query(connectedUser, criteria || {}, sort).cursor()
  //   criteria = resource.criteria(connectedUser, criteria || {});
  //   sort = resource.sort(connectedUser, sort);
  //   const cursor = await resource.store.cursor(criteria, sort);
  //   limit = resource.limit(limit);
  //   if (limit) cursor.limit(limit);
  //   return new ResourceServerCursor(resource, cursor, connectedUser);
  // }


}

Object.defineProperty(exports, 'ResourcesServerError', {
  enumerable: true,
  get: function () {
    return liwiResources.ResourcesServerError;
  }
});
exports.ResourcesServerService = ResourcesServerService;
//# sourceMappingURL=index-node10-dev.cjs.js.map
