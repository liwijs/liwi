import type { Query, QueryParams } from "liwi-resources-client";
import type { ResourceResult } from "./createResourceResultFromState";
import type { UseResourceOptions } from "./useResource";
export declare function useResource<Result, Params extends QueryParams<Params>>(createQuery: (initialParams: Params) => Query<Result, Params>, options: UseResourceOptions<Params>, deps: any[]): ResourceResult<Result, Params>;
//# sourceMappingURL=useResource.target-node.d.ts.map