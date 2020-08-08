import { Query, QueryParams } from 'liwi-resources-client';
import { SetOptional } from 'type-fest';
import { ResourceResult } from './createResourceResultFromState';
import { UseResourceAndSubscribeOptions } from './useRetrieveResourceAndSubscribe';
interface UseResourceOptionsRequiredParams<Params extends QueryParams<Params> | undefined> {
    params: Params;
    subscribe?: boolean;
    subscribeOptions?: UseResourceAndSubscribeOptions;
}
export declare type UseResourceOptions<Params extends QueryParams<Params> | undefined> = Params extends undefined ? SetOptional<UseResourceOptionsRequiredParams<Params>, 'params'> : UseResourceOptionsRequiredParams<Params>;
export declare function useResource<Result, Params extends QueryParams<Params> | undefined>(createQuery: (initialParams: Params) => Query<Result, Params>, { params, subscribe, subscribeOptions }: UseResourceOptions<Params>, deps: any[]): ResourceResult<Result, Params>;
export {};
//# sourceMappingURL=useResource.d.ts.map