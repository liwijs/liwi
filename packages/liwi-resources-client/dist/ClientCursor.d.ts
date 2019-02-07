import { AbstractCursor } from 'liwi-store';
import { BaseModel, QueryOptions } from 'liwi-types';
import AbstractClient from './AbstractClient';
export default class ClientCursor<Model extends BaseModel, KeyPath extends string, Client extends AbstractClient<Model, KeyPath>> extends AbstractCursor<Model, KeyPath> {
    key: any;
    private _idCursor?;
    private client;
    private options;
    private _result?;
    constructor(client: Client, options: QueryOptions<Model>);
    limit(newLimit: number): Promise<this>;
    _create(): Promise<void>;
    private emit;
    advance(count: number): this;
    next(): Promise<any>;
    result(): Promise<Model>;
    count(applyLimit?: boolean): Promise<any>;
    close(): Promise<void>;
    toArray(): Promise<Model[]>;
}
//# sourceMappingURL=ClientCursor.d.ts.map