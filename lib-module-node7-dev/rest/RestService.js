import RestCursor from './RestCursor';

import t from 'flow-runtime';
let RestService = class {
  constructor(restResources) {
    let _restResourcesType = t.ref('Map', t.string(), t.any());

    t.param('restResources', _restResourcesType).assert(restResources);

    this.restResources = restResources;
  }

  addRestResource(key, restResource) {
    let _keyType = t.string();

    t.param('key', _keyType).assert(key);

    this.restResources.set(key, restResource);
  }

  get(key) {
    let _keyType2 = t.string();

    t.param('key', _keyType2).assert(key);

    const restResource = this.restResources.get(key);
    if (!restResource) throw new Error(`Invalid rest resource: "${key}"`);
    return restResource;
  }

  async createCursor(restResource, connectedUser, _arg) {
    let _connectedUserType = t.nullable(t.object());

    const _returnType = t.return(t.mixed());

    t.param('connectedUser', _connectedUserType).assert(connectedUser);
    let { criteria, sort, limit } = t.object(t.property('criteria', t.nullable(t.object())), t.property('sort', t.nullable(t.object())), t.property('limit', t.nullable(t.number()))).assert(_arg);

    // TODO: restResource.query(connectedUser, criteria || {}, sort).cursor()
    criteria = restResource.criteria(connectedUser, criteria || {});
    sort = restResource.sort(connectedUser, sort);
    const cursor = await restResource.store.cursor(criteria, sort);
    limit = restResource.limit(limit);
    if (limit) cursor.limit(connectedUser, limit);
    return _returnType.assert(new RestCursor(restResource, connectedUser, cursor));
  }
};
export { RestService as default };
//# sourceMappingURL=RestService.js.map