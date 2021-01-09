import { AbstractStoreCursor } from 'liwi-store';
import { AllowedKeyValue } from 'liwi-types';
import { Cursor } from 'mongodb';
import { MongoBaseModel } from './MongoBaseModel';
import MongoStore from './MongoStore';
export default class MongoCursor<Model extends MongoBaseModel<KeyValue>, Result extends Partial<Model> = Model, KeyValue extends AllowedKeyValue = Model['_id']> extends AbstractStoreCursor<MongoStore<Model, KeyValue>, KeyValue, Model, Result> {
    private readonly cursor;
    private _result?;
    constructor(store: MongoStore<Model, KeyValue>, cursor: Cursor);
    advance(count: number): void;
    next(): Promise<any>;
    limit(newLimit: number): Promise<this>;
    count(applySkipLimit?: boolean): Promise<number>;
    result(): Promise<Result>;
    close(): Promise<void>;
    toArray(): Promise<Result[]>;
}
//# sourceMappingURL=MongoCursor.d.ts.map