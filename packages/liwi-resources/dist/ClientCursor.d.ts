import { AbstractCursor } from 'liwi-store';
import { BaseModel, QueryOptions } from 'liwi-types';
import AbstractClient from './AbstractClient';
export default class ClientCursor<Model extends BaseModel, KeyPath extends string> extends AbstractCursor<Model, KeyPath, AbstractClient<Model, KeyPath>> {
    _idCursor?: number;
    private options;
    private _result?;
    constructor(client: AbstractClient<Model, KeyPath>, options: QueryOptions<Model>);
    limit(newLimit: number): Promise<this>;
    _create(): Promise<void>;
    emit(type: string, ...args: Array<any>): Promise<any>;
    advance(count: number): this;
    next(): Promise<any>;
    result(): Promise<Model>;
    count(applyLimit?: boolean): Promise<any>;
    close(): Promise<void>;
    toArray(): Promise<Array<Model>>;
}
//# sourceMappingURL=ClientCursor.d.ts.map