import { InternalCommonStoreClient } from 'liwi-store';
import { BaseModel, Update, QueryOptions, ResourceOperationKey, Criteria } from 'liwi-types';
import ClientCursor from './ClientCursor';
import ClientQuery from './ClientQuery';
declare type UnsubscribeEmitOnConnectCallback = () => void;
export default abstract class AbstractClient<Model extends BaseModel, KeyPath extends string> implements InternalCommonStoreClient<Model, KeyPath, ClientCursor<Model, KeyPath, any>> {
    readonly resourceName: string;
    readonly keyPath: KeyPath;
    constructor(resourceName: string, keyPath: KeyPath);
    createQuery(key: string, params?: any): ClientQuery<Model, KeyPath>;
    abstract createCursor(options: QueryOptions<Model>): Promise<number>;
    abstract send<T>(key: ResourceOperationKey, value: any[]): Promise<T>;
    abstract on(event: string, listener: Function): void;
    abstract off(event: string, listener: Function): void;
    abstract emitSubscribe(type: string, args: any[]): Promise<UnsubscribeEmitOnConnectCallback>;
    findByKey(key: any, criteria?: Criteria<Model>): Promise<Model | undefined>;
    replaceOne(object: Model): Promise<Model>;
    partialUpdateByKey(key: any, partialUpdate: Update<Model>, criteria?: Criteria<Model>): Promise<Model>;
    deleteByKey(key: any, criteria?: Criteria<Model>): Promise<void>;
}
export {};
//# sourceMappingURL=AbstractClient.d.ts.map