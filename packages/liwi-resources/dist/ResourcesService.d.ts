import { BaseModel, Criteria, Sort } from 'liwi-types';
import ResourceCursor from './ResourceCursor';
import Resource from './Resource';
export interface CreateCursorOptions<Model extends BaseModel> {
    criteria?: Criteria<Model>;
    sort?: Sort<Model>;
    limit?: number;
}
export default class ResourcesService {
    resources: Map<string, Resource<any, any, any>>;
    constructor(resources: Map<string, Resource<any, any, any>>);
    addResource(key: string, resource: Resource<any, any, any>): void;
    get(key: string): Resource<any, any, any>;
    createCursor<Model extends BaseModel, Transformed, ConnectedUser>(resource: Resource<Model, Transformed, ConnectedUser>, connectedUser: any, { criteria, sort, limit }: CreateCursorOptions<Model>): Promise<ResourceCursor<Model, Transformed, ConnectedUser>>;
}
//# sourceMappingURL=ResourcesService.d.ts.map