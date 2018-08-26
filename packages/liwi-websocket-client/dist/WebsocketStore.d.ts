import { AbstractStore, AbstractConnection } from 'liwi-store';
import { BaseModel, Update, Criteria, Sort } from 'liwi-types';
import WebsocketCursor from './WebsocketCursor';
import Query from './Query';
export interface WebsocketConnection extends AbstractConnection {
    emit: (event: string, ...args: any[]) => Promise<any>;
    isConnected: () => boolean;
    isDisconnected: () => boolean;
    on: (event: string, listener: Function) => this;
    off: (event: string, listener: Function) => this;
}
export default class WebsocketStore<Model extends BaseModel, KeyPath extends string> extends AbstractStore<Model, KeyPath, WebsocketConnection, WebsocketCursor<Model, KeyPath>> {
    restName: string;
    constructor(websocket: WebsocketConnection, restName: string, keyPath: KeyPath);
    createQuery(key: string): Query<Model, KeyPath>;
    emitSubscribe(type: string, ...args: Array<any>): Promise<() => WebsocketConnection>;
    insertOne(object: Model): Promise<Model>;
    replaceOne(object: Model): Promise<Model>;
    upsertOne(object: Model): Promise<Model>;
    partialUpdateByKey(key: any, partialUpdate: Update<Model>): Promise<Model>;
    partialUpdateOne(object: Model, partialUpdate: Update<Model>): Promise<Model>;
    partialUpdateMany(criteria: Criteria<Model>, partialUpdate: Update<Model>): Promise<void>;
    deleteByKey(key: any): Promise<void>;
    deleteOne(object: Model): Promise<void>;
    cursor(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<WebsocketCursor<Model, KeyPath>>;
    findByKey(key: any): Promise<Model | undefined>;
    findOne(criteria: Criteria<Model>, sort?: Sort<Model>): Promise<Model | undefined>;
    emit(type: string, ...args: Array<any>): Promise<any>;
}
//# sourceMappingURL=WebsocketStore.d.ts.map