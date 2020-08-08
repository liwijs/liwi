import type { Query, QueryParams, QueryMeta } from 'liwi-resources-client';
import { QueryInfo } from 'liwi-types';
import type { State } from './reducer';
export interface ResourceResultInitialLoading<Data, Params extends QueryParams<Params> | undefined> {
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
export interface ResourceResultInitialError<Data, Params extends QueryParams<Params> | undefined> {
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
export interface ResourceResultLoaded<Data, Params extends QueryParams<Params> | undefined> {
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
export declare type ResourceResult<Data, Params extends QueryParams<Params> | undefined> = ResourceResultInitialLoading<Data, Params> | ResourceResultInitialError<Data, Params> | ResourceResultLoaded<Data, Params>;
export declare const createResourceResultFromState: <Result, Params extends Record<keyof Params, import("../../liwi-store/src/Query").AllowedParamValue> | undefined>(state: State<Result, Params>) => ResourceResult<Result, Params>;
//# sourceMappingURL=createResourceResultFromState.d.ts.map