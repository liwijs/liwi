import { OperationDescription, QueryDescription } from 'liwi-resources';
import { BaseModel } from 'liwi-types';
import ServiceResource from './ServiceResource';
interface Post extends BaseModel {
    title: string;
}
export interface PostServiceQueries {
    queryAll: QueryDescription<never, Post>;
    queryDetailedPost: QueryDescription<never, Post>;
}
export declare const postsResource1: ServiceResource<PostServiceQueries>;
export interface PostDeleteOperation {
    deviceId: string;
}
export interface PostsServiceOperations {
    delete: OperationDescription<PostDeleteOperation, boolean>;
}
export {};
//# sourceMappingURL=ServiceResource.testdts.d.ts.map