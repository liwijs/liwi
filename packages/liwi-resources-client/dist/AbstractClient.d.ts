import { InternalCommonStoreClient } from 'liwi-store';
import { BaseModel, Update, QueryOptions, ResourceOperationKey } from 'liwi-types';
import ClientCursor from './ClientCursor';
import ClientQuery from './ClientQuery';
declare type UnsubscribeCallback = () => void;
export default abstract class AbstractClient<Model extends BaseModel, KeyPath extends string> implements InternalCommonStoreClient<Model, KeyPath, ClientCursor<Model, KeyPath, any>> {
    readonly resourceName: string;
    readonly keyPath: KeyPath;
    constructor(resourceName: string, keyPath: KeyPath);
    createQuery(key: string): ClientQuery<Model, KeyPath>;
    abstract createCursor(options: QueryOptions<Model>): Promise<number>;
    abstract send<T>(key: ResourceOperationKey, value: any): Promise<T>;
    abstract on(event: string, listener: Function): void;
    abstract off(event: string, listener: Function): void;
    abstract emitSubscribe(type: string, args: any[]): Promise<UnsubscribeCallback>;
    findByKey(key: any): Promise<Model | undefined>;
    replaceOne(object: Model): Promise<Model>;
    partialUpdateByKey(key: any, partialUpdate: Update<Model>): Promise<Model>;
    deleteByKey(key: any): Promise<void>;
}
export {};
//# sourceMappingURL=AbstractClient.d.ts.map