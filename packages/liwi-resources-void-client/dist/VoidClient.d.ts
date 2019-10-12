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
        createQuery(key: string, params?: any): import("liwi-resources-client/dist/ClientQuery").default<Model, "_id", Model>;
        findByKey(key: any, criteria?: import("liwi-types").Criteria<Model> | undefined): Promise<Model | undefined>;
        replaceOne(object: Model): Promise<Model>;
        partialUpdateByKey(key: any, partialUpdate: import("liwi-types").Update<Model>, criteria?: import("liwi-types").Criteria<Model> | undefined): Promise<Model>;
        deleteByKey(key: any, criteria?: import("liwi-types").Criteria<Model> | undefined): Promise<void>;
    };
};
export {};
//# sourceMappingURL=VoidClient.d.ts.map