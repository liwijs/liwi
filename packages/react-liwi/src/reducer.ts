import type { Query, QueryParams } from 'liwi-resources-client';
import type { QueryMeta, QueryInfo } from 'liwi-types';
import type { Reducer } from 'react';

export interface InitialState<
  Result,
  Params extends QueryParams<Params> | undefined
> {
  fetched: false;
  fetching: true;
  query: Query<Result, Params>;
  result: undefined;
  meta: undefined;
  queryInfo: undefined;
  promise?: Promise<void>;
  error: undefined;
}

export interface InitialErrorState<
  Result,
  Params extends QueryParams<Params> | undefined
> {
  fetched: false;
  fetching: boolean;
  query: Query<Result, Params>;
  result: undefined;
  meta: undefined;
  queryInfo: undefined;
  promise?: Promise<void>;
  error: Error;
}

export interface FetchedState<
  Result,
  Params extends QueryParams<Params> | undefined
> {
  fetched: true;
  fetching: boolean;
  query: Query<Result, Params>;
  result: Result;
  meta: QueryMeta;
  queryInfo: QueryInfo<any>;
  promise?: Promise<void>;
  error: undefined | Error;
}

export interface InitAction {
  type: 'init';
}

export interface FetchingAction {
  type: 'fetching';
}

export interface RefetchAction {
  type: 'refetch';
  promise: Promise<void>;
}

export interface ResolveAction<Result> {
  type: 'resolve';
  result: Result;
  meta: QueryMeta;
  queryInfo: QueryInfo<any>;
}
export interface ErrorAction {
  type: 'error';
  error: Error;
}

export type Action<Result> =
  | ResolveAction<Result>
  | RefetchAction
  | FetchingAction
  | ErrorAction;
export type State<Result, Params extends QueryParams<Params> | undefined> =
  | InitialState<Result, Params>
  | InitialErrorState<Result, Params>
  | FetchedState<Result, Params>;
export type ResourceReducer<
  Result,
  Params extends QueryParams<Params> | undefined
> = Reducer<State<Result, Params>, Action<Result>>;
export interface ResourceReducerInitializerReturn<
  Result,
  Params extends QueryParams<Params> | undefined
> {
  query: Query<Result, Params>;
  promise?: Promise<void>;
}

export function initReducer<
  Result,
  Params extends QueryParams<Params> | undefined
>(
  initializer: () => ResourceReducerInitializerReturn<Result, Params>,
): InitialState<Result, Params> {
  const init = initializer();
  const { query, promise } = init;
  return {
    fetched: false,
    fetching: true,
    query,
    result: undefined,
    meta: undefined,
    queryInfo: undefined,
    promise,
    error: undefined,
  };
}

export default function reducer<
  Result,
  Params extends QueryParams<Params> | undefined
>(state: State<Result, Params>, action: Action<Result>): State<Result, Params> {
  switch (action.type) {
    case 'resolve':
      return {
        fetched: true,
        fetching: false,
        query: state.query,
        result: action.result,
        meta: action.meta,
        queryInfo: action.queryInfo,
        error: undefined,
      };
    case 'refetch':
      return {
        fetched: state.fetched,
        fetching: true,
        query: state.query,
        result: state.result,
        meta: state.meta,
        queryInfo: state.queryInfo,
        promise: action.promise,
        error: state.error,
      } as InitialState<Result, Params> | FetchedState<Result, Params>;
    case 'fetching':
      return {
        ...state,
        fetching: true,
      };
    case 'error':
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    default:
      throw new Error('Invalid action');
  }
}
