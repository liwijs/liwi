import { Cursor } from 'mongodb';
import { AbstractCursor } from 'liwi-store';
import MongoStore, { MongoModel, MongoKeyPath } from './MongoStore';
export default class MongoCursor<Model extends MongoModel> extends AbstractCursor<Model, MongoKeyPath, MongoStore<Model>> {
    private cursor;
    private _result?;
    constructor(store: MongoStore<Model>, cursor: Cursor);
    advance(count: number): void;
    next(): Promise<any>;
    limit(newLimit: number): Promise<this>;
    count(applyLimit?: boolean): Promise<number>;
    result(): Promise<Model>;
    close(): Promise<void>;
    toArray(): Promise<Array<Model>>;
}
//# sourceMappingURL=MongoCursor.d.ts.map