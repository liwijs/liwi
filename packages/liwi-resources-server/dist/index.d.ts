import { BaseModel } from 'liwi-types';
import { OperationDescriptions } from 'liwi-resources';
import ResourceInterface from './Resource';
export { default as ResourcesServerService } from './ResourcesServerService';
export declare type Resource<Model extends BaseModel, QueryKeys extends string, Operations extends OperationDescriptions, Transformed = any, ConnectedUser = any> = ResourceInterface<Model, QueryKeys, Operations, Transformed, ConnectedUser>;
//# sourceMappingURL=index.d.ts.map