import { OperationDescription, QueryDescription } from 'liwi-resources';
import { BaseModel } from 'liwi-types';
import ServiceResource from './ServiceResource';

interface Post extends BaseModel {
  title: string;
}

export interface PostServiceQueries {
  queryAll: QueryDescription<never, Post>;
  queryDetailedPost: QueryDescription<never, Post>;
  // badQuery: {};
}

export const postsResource1: ServiceResource<PostServiceQueries> = {
  queries: {
    queryAll: (params: void, connectedUser) => {
      return {} as any;
    },
    queryDetailedPost: (params: void, connectedUser) => {
      return {} as any;
    },
  },
  operations: {},
};

export interface PostDeleteOperation {
  deviceId: string;
}
export interface PostsServiceOperations {
  delete: OperationDescription<PostDeleteOperation, boolean>;
}

// export const postsResource2: ServiceResource<
//   PostServiceQueries,
//   PostsServiceOperations
// > = {
//   queries: {},
//   operations: {},
// };
