import type { Query, QueryParams, QueryMeta, ResourcesServerError } from 'liwi-resources-client';
import type { QueryInfo } from 'liwi-store';
import type { State } from './reducer';
export interface ResourceResultInitialLoading<Data, Params extends QueryParams<Params>> {
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
export interface ResourceResultInitialError<Data, Params extends QueryParams<Params>> {
    query: Query<Data, Params>;
    initialLoading: false;
    initialError: true;
    fetched: false;
    fetching: false;
    data: undefined;
    meta: undefined;
    queryInfo: undefined;
    error: Error | ResourcesServerError;
}
export interface ResourceResultLoaded<Data, Params extends QueryParams<Params>> {
    query: Query<Data, Params>;
    initialLoading: false;
    initialError: false;
    fetched: true;
    fetching: boolean;
    data: Data;
    meta: QueryMeta;
    queryInfo: QueryInfo<any>;
    error: Error | ResourcesServerError | undefined;
}
export type ResourceResult<Data, Params extends QueryParams<Params>> = ResourceResultInitialError<Data, Params> | ResourceResultInitialLoading<Data, Params> | ResourceResultLoaded<Data, Params>;
export declare const createResourceResultFromState: <Result, Params extends QueryParams<Params>>(state: State<Result, Params>) => ResourceResult<Result, Params>;
//# sourceMappingURL=createResourceResultFromState.d.ts.map