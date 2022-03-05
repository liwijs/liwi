import type { BaseModel } from 'liwi-types';
export default abstract class AbstractCursor<Model extends BaseModel, Result extends Partial<Model> = Model> {
    abstract close(): Promise<void> | void;
    abstract next(): Promise<any>;
    nextResult(): Promise<Result>;
    abstract limit(newLimit: number): Promise<this>;
    abstract toArray(): Promise<Result[]>;
    abstract result(): Promise<Result>;
    forEachKeys(callback: (key: any) => Promise<void> | void): Promise<void>;
    forEach(callback: (result: Result) => Promise<void> | void): Promise<void>;
    keysIterator(): Generator<Promise<any>, void, undefined>;
    [Symbol.iterator](): Generator<Promise<Result>, void, undefined>;
}
//# sourceMappingURL=AbstractCursor.d.ts.map