import { Query, QueryParams } from 'liwi-resources-client';
import { ResourceResult } from './createResourceResultFromState';
import { UseResourceAndSubscribeOptions } from './useRetrieveResourceAndSubscribe';
export interface UseResourceOptions<Params extends QueryParams<Params>> {
    params: Params;
    subscribe?: boolean;
    subscribeOptions?: UseResourceAndSubscribeOptions;
}
export declare function useResource<Result, Params extends QueryParams<Params>>(createQuery: (initialParams: Params) => Query<Result, Params>, { params, subscribe, subscribeOptions }: UseResourceOptions<Params>, deps: any[]): ResourceResult<Result, Params>;
//# sourceMappingURL=useResource.d.ts.map