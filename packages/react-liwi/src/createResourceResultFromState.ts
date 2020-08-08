import type { Query, QueryParams, QueryMeta } from 'liwi-resources-client';
import { QueryInfo } from 'liwi-types';
import type { State } from './reducer';

export interface ResourceResultInitialLoading<
  Data,
  Params extends QueryParams<Params> | undefined
> {
  query: Query<Data, Params>;
  initialLoading: true;
  initialError: false;
  fetched: false;
  fetching: true;
  data: undefined;
  meta: undefined;
  queryInfo: undefined;
  error: undefined;
}

export interface ResourceResultInitialError<
  Data,
  Params extends QueryParams<Params> | undefined
> {
  query: Query<Data, Params>;
  initialLoading: false;
  initialError: true;
  fetched: false;
  fetching: false;
  data: undefined;
  meta: undefined;
  queryInfo: undefined;
  error: Error;
}

export interface ResourceResultLoaded<
  Data,
  Params extends QueryParams<Params> | undefined
> {
  query: Query<Data, Params>;
  initialLoading: false;
  initialError: false;
  fetched: true;
  fetching: boolean;
  data: Data;
  meta: QueryMeta;
  queryInfo: QueryInfo<any>;
  error: undefined | Error;
}

export type ResourceResult<
  Data,
  Params extends QueryParams<Params> | undefined
> =
  | ResourceResultInitialLoading<Data, Params>
  | ResourceResultInitialError<Data, Params>
  | ResourceResultLoaded<Data, Params>;

export const createResourceResultFromState = <
  Result,
  Params extends QueryParams<Params> | undefined
>(
  state: State<Result, Params>,
): ResourceResult<Result, Params> =>
  ({
    query: state.query,
    initialLoading: !state.fetched && state.fetching,
    initialError: !state.fetched && !!state.error,
    fetched: state.fetched,
    fetching: state.fetching,
    data: !state.fetched ? undefined : state.result,
    meta: !state.fetched ? undefined : state.meta,
    queryInfo: !state.fetched ? undefined : state.queryInfo,
    error: state.error,
  } as ResourceResult<Result, Params>);
