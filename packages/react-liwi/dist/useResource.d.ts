import { Query, QueryParams } from 'liwi-resources-client';
import { SetOptional } from 'type-fest';
import { ResourceResult } from './createResourceResultFromState';
import { UseResourceAndSubscribeOptions } from './useRetrieveResourceAndSubscribe';
interface UseResourceOptionsRequiredParams<Params extends QueryParams<Params>> {
    params: Params;
    ssr?: boolean;
    subscribe?: boolean;
    subscribeOptions?: UseResourceAndSubscribeOptions;
}
export declare type UseResourceOptions<Params extends QueryParams<Params>> = Params extends {
    [key: string]: never;
} ? SetOptional<UseResourceOptionsRequiredParams<Params>, 'params'> : UseResourceOptionsRequiredParams<Params>;
export declare function useResource<Result, Params extends QueryParams<Params>>(createQuery: (initialParams: Params) => Query<Result, Params>, { params, subscribe, subscribeOptions, ssr }: UseResourceOptions<Params>, deps: any[]): ResourceResult<Result, Params>;
export {};
//# sourceMappingURL=useResource.d.ts.map