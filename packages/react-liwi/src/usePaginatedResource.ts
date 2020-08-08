import { Query, QueryParams } from 'liwi-resources-client';
import { useMemo } from 'react';
import {
  ResourceResultInitialLoading,
  ResourceResultInitialError,
  ResourceResultLoaded,
} from './createResourceResultFromState';
import { useResource, UseResourceOptions } from './useResource';

type PaginatedQueryParams<Params> = QueryParams<Params> &
  Record<'page', number>;

type UsePaginatedResourceOptions<
  Params extends PaginatedQueryParams<Params>
> = UseResourceOptions<Params>;

interface Pagination {
  totalPages: number;
}

interface PaginatedResourceResultInitialLoading<
  Data,
  Params extends PaginatedQueryParams<Params>
> extends ResourceResultInitialLoading<Data, Params> {
  pagination: undefined;
}

interface PaginatedResourceResultInitialError<
  Data,
  Params extends PaginatedQueryParams<Params>
> extends ResourceResultInitialError<Data, Params> {
  pagination: undefined;
}

interface PaginatedResourceResultLoaded<
  Data,
  Params extends PaginatedQueryParams<Params>
> extends ResourceResultLoaded<Data, Params> {
  pagination: Pagination;
}

export type PaginatedResourceResult<
  Data,
  Params extends PaginatedQueryParams<Params>
> =
  | PaginatedResourceResultInitialLoading<Data, Params>
  | PaginatedResourceResultInitialError<Data, Params>
  | PaginatedResourceResultLoaded<Data, Params>;

export function usePaginatedResource<
  Result,
  Params extends PaginatedQueryParams<Params>
>(
  createQuery: (initialParams: Params) => Query<Result, Params>,
  options: UsePaginatedResourceOptions<Params>,
  deps: any[],
): PaginatedResourceResult<Result, Params> {
  const result = useResource(createQuery, options, deps);
  const total = result.meta?.total;
  const limit = result.queryInfo?.limit;

  const pagination = useMemo<Pagination | undefined>(() => {
    if (total === undefined) return undefined;

    return {
      totalPages: limit ? Math.ceil(total / limit) : 1,
    };
  }, [total, limit]);

  return useMemo(
    () =>
      ({ ...result, pagination } as PaginatedResourceResult<Result, Params>),
    [result, pagination],
  );
}
