import { BaseModel, Criteria, Sort } from 'liwi-types';
import ResourceServerCursor from './ResourceServerCursor';
import Resource from './Resource';
export interface CreateCursorOptions<Model extends BaseModel> {
    criteria?: Criteria<Model>;
    sort?: Sort<Model>;
    limit?: number;
}
export default class ResourcesServerService {
    resources: Map<string, Resource<any, any, any, any, any>>;
    constructor(resources: Map<string, Resource<any, any, any, any, any>>);
    addResource(key: string, resource: Resource<any, any, any, any, any>): void;
    get(key: string): Resource<any, any, any, any, any>;
    createCursor<Model extends BaseModel, Transformed, ConnectedUser>(resource: Resource<Model, any, any, Transformed, ConnectedUser>, connectedUser: ConnectedUser, { criteria, sort, limit }: CreateCursorOptions<Model>): Promise<ResourceServerCursor<Model, Transformed, ConnectedUser>>;
}
//# sourceMappingURL=ResourcesServerService.d.ts.map