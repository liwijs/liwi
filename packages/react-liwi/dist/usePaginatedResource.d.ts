import { Query, QueryParams } from 'liwi-resources-client';
import { ResourceResultInitialLoading, ResourceResultInitialError, ResourceResultLoaded } from './createResourceResultFromState';
import { UseResourceOptions } from './useResource';
declare type PaginatedQueryParams<Params> = QueryParams<Params> & Record<'page', number>;
declare type UsePaginatedResourceOptions<Params extends PaginatedQueryParams<Params>> = UseResourceOptions<Params>;
interface Pagination {
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
export declare type PaginatedResourceResult<Data, Params extends PaginatedQueryParams<Params>> = PaginatedResourceResultInitialLoading<Data, Params> | PaginatedResourceResultInitialError<Data, Params> | PaginatedResourceResultLoaded<Data, Params>;
export declare function usePaginatedResource<Result, Params extends PaginatedQueryParams<Params>>(createQuery: (initialParams: Params) => Query<Result, Params>, options: UsePaginatedResourceOptions<Params>, deps: any[]): PaginatedResourceResult<Result, Params>;
export {};
//# sourceMappingURL=usePaginatedResource.d.ts.map