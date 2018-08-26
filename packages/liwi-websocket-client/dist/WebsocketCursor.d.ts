import { AbstractCursor } from 'liwi-store';
import { BaseModel, Criteria, Sort } from 'liwi-types';
import WebsocketStore from './WebsocketStore';
export interface Options<Model extends BaseModel> {
    criteria?: Criteria<Model>;
    sort?: Sort<Model>;
    limit?: number;
}
export default class WebsocketCursor<Model extends BaseModel, KeyPath extends string> extends AbstractCursor<Model, KeyPath, WebsocketStore<Model, any>> {
    _idCursor?: number;
    private options;
    private _result?;
    constructor(store: WebsocketStore<Model, any>, options: Options<Model>);
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
//# sourceMappingURL=WebsocketCursor.d.ts.map