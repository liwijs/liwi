import { Query, QueryParams } from 'liwi-resources-client';
import { ResourceResult } from './createResourceResultFromState';
export declare function useRetrieveResource<Result, Params extends QueryParams<Params>>(createQuery: (initialParams: Params) => Query<Result, Params>, params: Params, skip: boolean, deps: any[]): ResourceResult<Result, Params>;
//# sourceMappingURL=useRetrieveResource.d.ts.map