import type { Changes, QueryInfo, QueryMeta } from 'liwi-types';
export declare type ApplyChanges<Result, Value> = (state: undefined | Result, changes: Changes<any, Result>, queryMeta: QueryMeta, queryInfo: QueryInfo<Value>) => {
    state: undefined | Result;
    meta: QueryMeta;
};
//# sourceMappingURL=ApplyChanges.d.ts.map