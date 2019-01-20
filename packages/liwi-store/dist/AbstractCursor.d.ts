import { BaseModel } from 'liwi-types';
import InternalCommonStoreClient from './InternalCommonStoreClient';
export default abstract class AbstractCursor<Model extends BaseModel, KeyPath extends string, Store extends InternalCommonStoreClient<Model, KeyPath, any>> {
    key: any;
    protected _store: Store;
    constructor(store: Store);
    readonly store: Store;
    overrideStore(store: Store): void;
    abstract close(): Promise<void> | void;
    abstract next(): Promise<any>;
    nextResult(): Promise<Model>;
    abstract limit(newLimit: number): Promise<this>;
    abstract count(applyLimit: boolean): Promise<number>;
    abstract toArray(): Promise<Array<Model>>;
    result(): Promise<Model>;
    delete(): Promise<void>;
    forEachKeys(callback: (key: any) => any): Promise<void>;
    forEach(callback: (result: Model) => any): Promise<void>;
    keysIterator(): IterableIterator<Promise<any>>;
    [Symbol.iterator](): IterableIterator<Promise<Model>>;
}
//# sourceMappingURL=AbstractCursor.d.ts.map