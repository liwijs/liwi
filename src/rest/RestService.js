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
        { criteria, sort, limit }: { criteria: ?Object; sort: ?Object; limit: ?number }
    ): Promise {
        const restResource = this.get(restName);
        criteria = restResource.criteria(null, criteria || {});
        sort = restResource.sort(null, sort);
        const cursor = await restResource.store.cursor(criteria, sort);
        if (limit) cursor.limit(limit);
        return new RestCursor(cursor);
    }
}
