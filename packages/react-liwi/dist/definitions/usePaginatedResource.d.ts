import type { Query, QueryParams } from "liwi-resources-client";
import type { ResourceResultInitialError, ResourceResultInitialLoading, ResourceResultLoaded } from "./createResourceResultFromState";
import type { UseResourceOptions } from "./useResource";
export interface PaginatedQueryRequiredParams {
    page: number;
}
type PaginatedQueryParams<Params extends Record<string, unknown>> = PaginatedQueryRequiredParams & QueryParams<Params>;
type UsePaginatedResourceOptions<Params extends PaginatedQueryParams<Params>> = UseResourceOptions<Params>;
export interface Pagination {
    totalPages: number;
}
interface PaginatedResourceResultInitialLoading<Data, Params extends PaginatedQueryParams<Params>> extends ResourceResultInitialLoading<Data, Params> {
    pagination: undefined;
}
interface PaginatedResourceResultInitialError<Data, Params extends PaginatedQueryParams<Params>> extends ResourceResultInitialError<Data, Params> {
    pagination: undefined;
}
interface PaginatedResourceResultLoaded<Data, Params extends PaginatedQueryParams<Params>> extends ResourceResultLoaded<Data, Params> {
    pagination: Pagination;
}
export type PaginatedResourceResult<Data, Params extends PaginatedQueryParams<Params>> = PaginatedResourceResultInitialError<Data, Params> | PaginatedResourceResultInitialLoading<Data, Params> | PaginatedResourceResultLoaded<Data, Params>;
export declare function usePaginatedResource<Result, Params extends PaginatedQueryParams<Params>>(createQuery: (initialParams: Params) => Query<Result, Params>, options: UsePaginatedResourceOptions<Params>, deps: any[]): PaginatedResourceResult<Result, Params>;
export {};
//# sourceMappingURL=usePaginatedResource.d.ts.map