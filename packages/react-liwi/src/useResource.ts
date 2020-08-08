import { POB_TARGET } from 'pob-babel';
import { Query, QueryParams } from 'liwi-resources-client';
import { SetOptional } from 'type-fest';
import { ResourceResult } from './createResourceResultFromState';
import { useRetrieveResource } from './useRetrieveResource';
import {
  useRetrieveResourceAndSubscribe,
  UseResourceAndSubscribeOptions,
} from './useRetrieveResourceAndSubscribe';

interface UseResourceOptionsRequiredParams<Params extends QueryParams<Params>> {
  params: Params;
  subscribe?: boolean;
  subscribeOptions?: UseResourceAndSubscribeOptions;
}

export type UseResourceOptions<
  Params extends QueryParams<Params> | undefined
> = Params extends undefined
  ? SetOptional<UseResourceOptionsRequiredParams<Params>, 'params'>
  : UseResourceOptionsRequiredParams<Params>;

export function useResource<Result, Params extends QueryParams<Params>>(
  createQuery: (initialParams: Params) => Query<Result, Params>,
  { params, subscribe, subscribeOptions }: UseResourceOptions<Params>,
  deps: any[],
): ResourceResult<Result, Params> {
  if (POB_TARGET === 'node') {
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

  const result = subscribe
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useRetrieveResourceAndSubscribe<Result, Params>(
        createQuery,
        params as Params,
        deps,
        subscribeOptions,
      )
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useRetrieveResource<Result, Params>(createQuery, params as Params, deps);

  return result;
}
