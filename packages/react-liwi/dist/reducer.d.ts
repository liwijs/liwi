import type { Query, QueryParams } from 'liwi-resources-client';
import type { QueryMeta, QueryInfo } from 'liwi-types';
import type { Reducer } from 'react';
export interface InitialState<Result, Params extends QueryParams<Params>> {
    fetched: false;
    fetching: true;
    query: Query<Result, Params>;
    result: undefined;
    meta: undefined;
    queryInfo: undefined;
    promise?: Promise<void>;
    error: undefined;
}
export interface InitialErrorState<Result, Params extends QueryParams<Params>> {
    fetched: false;
    fetching: boolean;
    query: Query<Result, Params>;
    result: undefined;
    meta: undefined;
    queryInfo: undefined;
    promise?: Promise<void>;
    error: Error;
}
export interface FetchedState<Result, Params extends QueryParams<Params>> {
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
export declare type Action<Result> = ResolveAction<Result> | RefetchAction | FetchingAction | ErrorAction;
export declare type State<Result, Params extends QueryParams<Params>> = InitialState<Result, Params> | InitialErrorState<Result, Params> | FetchedState<Result, Params>;
export declare type ResourceReducer<Result, Params extends QueryParams<Params>> = Reducer<State<Result, Params>, Action<Result>>;
export interface ResourceReducerInitializerReturn<Result, Params extends QueryParams<Params>> {
    query: Query<Result, Params>;
    promise?: Promise<void>;
}
export declare function initReducer<Result, Params extends QueryParams<Params>>(initializer: () => ResourceReducerInitializerReturn<Result, Params>): InitialState<Result, Params>;
export default function reducer<Result, Params extends QueryParams<Params>>(state: State<Result, Params>, action: Action<Result>): State<Result, Params>;
//# sourceMappingURL=reducer.d.ts.map