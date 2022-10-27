import type { Changes, QueryInfo, QueryMeta } from 'liwi-store';
export declare function applySingleItemChanges<Value extends Record<keyof Value, unknown>>(state: undefined | Value | null, changes: Changes<any, Value | null>, queryMeta: QueryMeta, queryInfo: QueryInfo<Value>): {
    state: undefined | Value | null;
    meta: QueryMeta;
};
//# sourceMappingURL=applySingleItemChanges.d.ts.map