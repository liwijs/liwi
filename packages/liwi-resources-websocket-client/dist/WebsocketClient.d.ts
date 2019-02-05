import { BaseModel, QueryOptions } from 'liwi-types';
import { AbstractClient } from 'liwi-resources-client';
export interface Websocket {
    emit: (event: string, ...args: any[]) => Promise<any>;
    isConnected: () => boolean;
    isDisconnected: () => boolean;
    on: <T extends Function>(event: string, handler: T) => T;
    off: (event: string, handler: Function) => void;
}
declare type UnsubscribeCallback = () => void;
export default class WebsocketClient<Model extends BaseModel, KeyPath extends string> extends AbstractClient<Model, KeyPath> {
    readonly resourceName: string;
    private readonly websocket;
    constructor(websocket: Websocket, resourceName: string, keyPath: KeyPath);
    emitSubscribe(type: string, ...args: any[]): Promise<UnsubscribeCallback>;
    createCursor(options: QueryOptions<Model>): Promise<number>;
    send(type: string, ...args: any[]): Promise<any>;
    on(event: string, handler: Function): Function;
    off(event: string, handler: Function): void;
}
export {};
//# sourceMappingURL=WebsocketClient.d.ts.map