import { BaseModel } from 'liwi-types';
import { QueryDescriptions, OperationDescriptions } from 'liwi-resources';
import ClientQuery from './ClientQuery';
import AbstractClient from './AbstractClient';
export { default as AbstractClient } from './AbstractClient';
export declare type ResourcesClientQueries<Queries extends QueryDescriptions> = {
    [P in keyof Queries]: (params: Queries[P]['params']) => ClientQuery<Queries[P]['model'], '_id'>;
};
export declare type ResourcesClientOperations<Operations extends OperationDescriptions> = {
    [P in keyof Operations]: (params: Operations[P]['params']) => Promise<Operations[P]['result']>;
};
export interface ResourcesClientService<Queries extends QueryDescriptions, Operations extends OperationDescriptions = {}> {
    queries: ResourcesClientQueries<Queries>;
    operations: ResourcesClientOperations<Operations>;
}
interface CreateResourceClientOptions<QueryKeys extends string, OperationKeys extends string> {
    queries: QueryKeys[];
    operations: OperationKeys[];
}
export declare const createResourceClient: <Queries extends QueryDescriptions, Operations extends OperationDescriptions, Model extends BaseModel, KeyPath extends string = "_id">(client: AbstractClient<Model, KeyPath>, options: CreateResourceClientOptions<string, string>) => ResourcesClientService<Queries, Operations>;
//# sourceMappingURL=index.d.ts.map