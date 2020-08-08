import { Query, QueryParams } from 'liwi-resources-client';
import { ResourceResult } from './createResourceResultFromState';
export interface UseResourceAndSubscribeOptions {
    visibleTimeout: number;
}
export declare function useRetrieveResourceAndSubscribe<Result, Params extends QueryParams<Params>>(createQuery: (initialParams: Params) => Query<Result, Params>, params: Params, deps: any[], { visibleTimeout }?: UseResourceAndSubscribeOptions): ResourceResult<Result, Params>;
//# sourceMappingURL=useRetrieveResourceAndSubscribe.d.ts.map