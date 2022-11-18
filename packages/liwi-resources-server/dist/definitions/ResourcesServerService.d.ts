import type { BaseModel, Criteria, Sort } from 'liwi-store';
import type { ServiceResource } from './ServiceResource';
export interface CreateCursorOptions<Model extends BaseModel> {
    criteria?: Criteria<Model>;
    sort?: Sort<Model>;
    limit?: number;
}
export declare class ResourcesServerService {
    readonly serviceResources: Map<string, ServiceResource<any, any>>;
    constructor({ serviceResources, }: {
        serviceResources: Map<string, ServiceResource<any, any>>;
    });
    addResource(key: string, resource: ServiceResource<any, any>): void;
    getServiceResource(key: string): ServiceResource<any, any>;
}
//# sourceMappingURL=ResourcesServerService.d.ts.map