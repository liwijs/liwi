import { BaseModel } from 'liwi-types';
export default abstract class AbstractCursor<Model extends BaseModel, KeyPath extends string> {
    abstract close(): Promise<void> | void;
    abstract next(): Promise<any>;
    nextResult(): Promise<Model>;
    abstract limit(newLimit: number): Promise<this>;
    abstract count(applyLimit: boolean): Promise<number>;
    abstract toArray(): Promise<Model[]>;
    abstract result(): Promise<Model>;
    forEachKeys(callback: (key: any) => any): Promise<void>;
    forEach(callback: (result: Model) => any): Promise<void>;
    keysIterator(): IterableIterator<Promise<any>>;
    [Symbol.iterator](): IterableIterator<Promise<Model>>;
}
//# sourceMappingURL=AbstractCursor.d.ts.map