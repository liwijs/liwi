import { BaseModel, Criteria, Sort } from 'liwi-types';
import ResourceServerCursor from './ResourceServerCursor';
import ServiceResource from './ServiceResource';
import CursorResource from './CursorResource';
export interface CreateCursorOptions<Model extends BaseModel> {
    criteria?: Criteria<Model>;
    sort?: Sort<Model>;
    limit?: number;
}
export default class ResourcesServerService {
    readonly serviceResources: Map<string, ServiceResource<any, any, any>>;
    readonly cursorResources: Map<string, CursorResource<any, any, any>>;
    constructor(serviceResources: Map<string, ServiceResource<any, any, any>>, cursorResources: Map<string, CursorResource<any, any, any>>);
    addResource(key: string, resource: ServiceResource<any, any, any>): void;
    addCursorResource(key: string, cursorResource: CursorResource<any, any, any>): void;
    getServiceResource(key: string): ServiceResource<any, any, any>;
    getCursorResource(key: string): CursorResource<any, any, any>;
    createCursor<Model extends BaseModel, Transformed, ConnectedUser>(resource: CursorResource<Model, Transformed, ConnectedUser>, connectedUser: ConnectedUser, { criteria, sort, limit }: CreateCursorOptions<Model>): Promise<ResourceServerCursor<Model, Transformed, ConnectedUser>>;
}
//# sourceMappingURL=ResourcesServerService.d.ts.map