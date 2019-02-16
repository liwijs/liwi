import { BaseModel, QueryOptions } from 'liwi-types';
import { AbstractClient } from 'liwi-resources-client';
declare type UnsubscribeEmitOnConnectCallback = () => void;
export declare class VoidClient<Model extends BaseModel, KeyPath extends string> extends AbstractClient<Model, KeyPath> {
    emitSubscribe(type: string, args: any[]): Promise<UnsubscribeEmitOnConnectCallback>;
    createCursor(options: QueryOptions<Model>): Promise<number>;
    send(type: string, value: any[]): Promise<any>;
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
}
export declare function createMongoResourcesVoidClient(): {
    new <Model extends BaseModel>(resourceName: string): {
        emitSubscribe(type: string, args: any[]): Promise<UnsubscribeEmitOnConnectCallback>;
        createCursor(options: QueryOptions<Model>): Promise<number>;
        send(type: string, value: any[]): Promise<any>;
        on(event: string, handler: Function): void;
        off(event: string, handler: Function): void;
        readonly resourceName: string;
        readonly keyPath: "_id";
        createQuery(key: string, params?: any): import("../../liwi-resources-client/dist/ClientQuery").default<Model, "_id">;
        findByKey(key: any): Promise<Model | undefined>;
        replaceOne(object: Model): Promise<Model>;
        partialUpdateByKey(key: any, partialUpdate: import("liwi-types").Update<Model>): Promise<Model>;
        deleteByKey(key: any): Promise<void>;
    };
};
export {};
//# sourceMappingURL=VoidClient.d.ts.map