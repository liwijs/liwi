import type { Query, QueryParams } from "liwi-resources-client";
import type { SetOptional } from "liwi-store";
import type { ResourceResult } from "./createResourceResultFromState";
import type { UseResourceAndSubscribeOptions } from "./useRetrieveResourceAndSubscribe";
interface UseResourceOptionsRequiredParams<Params extends QueryParams<Params>> {
    params: Params;
    skip?: boolean;
    subscribe?: boolean;
    subscribeOptions?: UseResourceAndSubscribeOptions;
}
export type UseResourceOptions<Params extends QueryParams<Params>> = Params extends Record<string, never> ? SetOptional<UseResourceOptionsRequiredParams<Params>, "params"> : UseResourceOptionsRequiredParams<Params>;
export declare function useResource<Result, Params extends QueryParams<Params>>(createQuery: (initialParams: Params) => Query<Result, Params>, { params, skip, subscribe, subscribeOptions, }: UseResourceOptions<Params>, deps: any[]): ResourceResult<Result, Params>;
export {};
//# sourceMappingURL=useResource.d.ts.map