import type { Query, QueryParams } from "liwi-resources-client";
import type { SetOptional } from "liwi-store";
import { POB_TARGET } from "pob-babel";
import type { ResourceResult } from "./createResourceResultFromState";
import { useRetrieveResource } from "./useRetrieveResource";
import type { UseResourceAndSubscribeOptions } from "./useRetrieveResourceAndSubscribe";
import { useRetrieveResourceAndSubscribe } from "./useRetrieveResourceAndSubscribe";

interface UseResourceOptionsRequiredParams<Params extends QueryParams<Params>> {
  params: Params;
  skip?: boolean;
  subscribe?: boolean;
  subscribeOptions?: UseResourceAndSubscribeOptions;
}

export type UseResourceOptions<Params extends QueryParams<Params>> =
  Params extends Record<string, never>
    ? SetOptional<UseResourceOptionsRequiredParams<Params>, "params">
    : UseResourceOptionsRequiredParams<Params>;

const isSSR = typeof window === "undefined";

export function useResource<Result, Params extends QueryParams<Params>>(
  createQuery: (initialParams: Params) => Query<Result, Params>,
  {
    params,
    skip = false,
    subscribe,
    subscribeOptions,
  }: UseResourceOptions<Params>,
  deps: any[],
): ResourceResult<Result, Params> {
  if (POB_TARGET === "node") {
    return {
      query: undefined as any,
      initialLoading: true,
      initialError: false,
      fetched: false,
      fetching: true,
      data: undefined,
      meta: undefined,
      queryInfo: undefined,
      error: undefined,
    };
  }

  const result =
    subscribe && !isSSR
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useRetrieveResourceAndSubscribe<Result, Params>(
          createQuery,
          params as Params,
          skip,
          deps,
          subscribeOptions,
        )
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useRetrieveResource<Result, Params>(
          createQuery,
          params as Params,
          skip,
          deps,
        );

  return result;
}
