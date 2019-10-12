import { BaseModel, QueryOptions } from 'liwi-types';
import { AbstractClient } from 'liwi-resources-client';
export interface Websocket {
    emit: (event: string, ...args: any[]) => Promise<any>;
    isConnected: () => boolean;
    isDisconnected: () => boolean;
    on: <T extends Function>(event: string, handler: T) => T;
    off: (event: string, handler: Function) => void;
}
declare type UnsubscribeEmitOnConnectCallback = () => void;
export default class WebsocketClient<Model extends BaseModel, KeyPath extends string> extends AbstractClient<Model, KeyPath> {
    readonly resourceName: string;
    readonly websocket: Websocket;
    constructor(websocket: Websocket, resourceName: string, keyPath: KeyPath);
    emitSubscribe(type: string, args: any[]): Promise<UnsubscribeEmitOnConnectCallback>;
    createCursor(options: QueryOptions<Model>): Promise<number>;
    send(type: string, value: any[]): Promise<any>;
    on(event: string, handler: Function): Function;
    off(event: string, handler: Function): void;
}
export declare function createMongoResourcesWebsocketClient(websocket: Websocket): {
    new <Model extends BaseModel>(resourceName: string): {
        readonly resourceName: string;
        readonly websocket: Websocket;
        emitSubscribe(type: string, args: any[]): Promise<UnsubscribeEmitOnConnectCallback>;
        createCursor(options: QueryOptions<Model>): Promise<number>;
        send(type: string, value: any[]): Promise<any>;
        on(event: string, handler: Function): Function;
        off(event: string, handler: Function): void;
        readonly keyPath: "_id";
        createQuery(key: string, params?: any): import("liwi-resources-client/dist/ClientQuery").default<Model, "_id", Model>;
        findByKey(key: any, criteria?: import("liwi-types").Criteria<Model> | undefined): Promise<Model | undefined>;
        replaceOne(object: Model): Promise<Model>;
        partialUpdateByKey(key: any, partialUpdate: import("liwi-types").Update<Model>, criteria?: import("liwi-types").Criteria<Model> | undefined): Promise<Model>;
        deleteByKey(key: any, criteria?: import("liwi-types").Criteria<Model> | undefined): Promise<void>;
    };
};
export {};
//# sourceMappingURL=WebsocketClient.d.ts.map