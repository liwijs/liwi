import type { Changes, QueryInfo, QueryMeta } from 'liwi-store';
export declare function applySingleItemChanges<Value extends Record<keyof Value, unknown>>(state: Value | null | undefined, changes: Changes<any, Value | null>, queryMeta: QueryMeta, queryInfo: QueryInfo<Value>): {
    state: Value | null | undefined;
    meta: QueryMeta;
};
//# sourceMappingURL=applySingleItemChanges.d.ts.map