import { BaseModel } from 'liwi-types';
import { OperationDescription } from 'liwi-resources';
import ClientQuery from './ClientQuery';
import AbstractClient from './AbstractClient';
export { default as AbstractClient } from './AbstractClient';
export declare type ResourcesClientOperations<Operations extends Record<string, OperationDescription<any, any>>> = {
    [P in keyof Operations]: (params: Operations[P]['params']) => Promise<Operations[P]['result']>;
};
export interface ResourcesClientService<QueryKeys extends string, Operations extends Record<string, OperationDescription<any, any>>, Model extends BaseModel, KeyPath extends string = '_id'> {
    queries: Record<QueryKeys, ClientQuery<Model, KeyPath>>;
    operations: ResourcesClientOperations<Operations>;
}
interface CreateResourceClientOptions<QueryKeys extends string, OperationKeys extends string> {
    queries: QueryKeys[];
    operations: OperationKeys[];
}
export declare const createResourceClient: <QueryKeys extends string, OperationKeys extends string, Operations extends Record<OperationKeys, OperationDescription<any, any>>, Model extends BaseModel, KeyPath extends string = "_id">(client: AbstractClient<Model, KeyPath>, options: CreateResourceClientOptions<QueryKeys, OperationKeys>) => ResourcesClientService<QueryKeys, Operations, Model, KeyPath>;
//# sourceMappingURL=index.d.ts.map