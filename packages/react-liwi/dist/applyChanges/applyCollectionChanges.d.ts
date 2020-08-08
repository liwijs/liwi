import { Changes, QueryInfo, QueryMeta } from 'liwi-types';
export declare function applyCollectionChanges<Result extends Item[], Item>(state: undefined | Item[], changes: Changes<any, Item[]>, queryMeta: QueryMeta, queryInfo: QueryInfo<Item>): {
    state: undefined | Item[];
    meta: QueryMeta;
};
//# sourceMappingURL=applyCollectionChanges.d.ts.map