import ts from 'typescript';

const common = `
import { OperationDescription, QueryDescription } from 'liwi-resources';
import { BaseModel } from 'liwi-store';
import ServiceResource from '../ServiceResource';

interface Post extends BaseModel {
  title: string;
}

export interface PostServiceQueries {
  queryAll: QueryDescription<never, Post>;
  queryDetailedPost: QueryDescription<never, Post>;
  // badQuery: {};
}

export interface PostServiceQueriesWithBadQuery {
  queryAll: QueryDescription<never, Post>;
  queryDetailedPost: QueryDescription<never, Post>;
  badQuery: {};
}

`;
//
// const tsRunDiagnostics = () => {
//   let program = ts.createProgram(fileNames, options);
//   let emitResult = program.emit();
//
//   let allDiagnostics = ts
//     .getPreEmitDiagnostics(program)
//     .concat(emitResult.diagnostics);
// }
//
it('should transpile without error on simple queries', () => {
  expect(
    ts.transpileModule(
      `${common}
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
`,
      {},
    ),
  ).toMatchSnapshot();
});
//
// it('should throw', () => {
//   expect(
//     ts.transpileModule(
//       `${common}
// export const postsResource1: ServiceResource<PostServiceQueries> = {
//   queries: {
//     queryAll: (params: void, connectedUser) => {
//       return {} as any;
//     },
//     queryDetailedPost: (params: void, connectedUser) => {
//       return {} as any;
//     },
//     unexpectedQuery: () => {},
//   },
//   operations: {},
// };
// `,
//       {},
//     ),
//   ).toMatchSnapshot();
// });
//
// // // @dts-jest:pass:snap
// //
// //
// // // @dts-jest:fail:snap
// // export const postsResource2: ServiceResource<PostServiceQueriesWithBadQuery> = {
// //   queries: {},
// //   operations: {},
// // };
// //
// // export interface PostDeleteOperation {
// //   deviceId: string;
// // }
// // export interface PostsServiceOperations {
// //   delete: OperationDescription<PostDeleteOperation, boolean>;
// // }
// //
// // // export const postsResource2: ServiceResource<
// // //   PostServiceQueries,
// // //   PostsServiceOperations
// // // > = {
// // //   queries: {},
// // //   operations: {},
// // // };
