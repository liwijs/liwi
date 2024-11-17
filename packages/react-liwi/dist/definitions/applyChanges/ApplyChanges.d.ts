import type { Changes, QueryInfo, QueryMeta } from "liwi-store";
export type ApplyChanges<Result, Value> = (state: Result | undefined, changes: Changes<any, Result>, queryMeta: QueryMeta, queryInfo: QueryInfo<Value>) => {
    state: Result | undefined;
    meta: QueryMeta;
};
//# sourceMappingURL=ApplyChanges.d.ts.map