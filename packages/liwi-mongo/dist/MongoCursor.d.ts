import { Cursor } from 'mongodb';
import { AbstractStoreCursor } from 'liwi-store';
import MongoStore, { MongoModel, MongoKeyPath } from './MongoStore';
export default class MongoCursor<Model extends MongoModel> extends AbstractStoreCursor<Model, MongoKeyPath, MongoStore<Model>> {
    private readonly cursor;
    private _result?;
    constructor(store: MongoStore<Model>, cursor: Cursor);
    advance(count: number): void;
    next(): Promise<any>;
    limit(newLimit: number): Promise<this>;
    count(applyLimit?: boolean): Promise<number>;
    result(): Promise<Model>;
    close(): Promise<void>;
    toArray(): Promise<Model[]>;
}
//# sourceMappingURL=MongoCursor.d.ts.map