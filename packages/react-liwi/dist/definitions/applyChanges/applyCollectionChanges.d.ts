import type { Changes, QueryInfo, QueryMeta } from "liwi-store";
export declare function applyCollectionChanges<Item>(state: Item[] | undefined, changes: Changes<any, Item[]>, queryMeta: QueryMeta, queryInfo: QueryInfo<Item>): {
    state: Item[] | undefined;
    meta: QueryMeta;
};
//# sourceMappingURL=applyCollectionChanges.d.ts.map