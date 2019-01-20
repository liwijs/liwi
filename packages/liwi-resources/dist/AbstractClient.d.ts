import { InternalCommonStoreClient, UpsertResult } from 'liwi-store';
import { BaseModel, Criteria, InsertType, Sort, Update, QueryOptions } from 'liwi-types';
import ClientCursor from './ClientCursor';
import ClientQuery from './ClientQuery';
import { ResourceOperationKey } from '.';
declare type UnsubscribeCallback = () => void;
export default abstract class AbstractClient<Model extends BaseModel, KeyPath extends string> implements InternalCommonStoreClient<Model, KeyPath, ClientCursor<Model, KeyPath>> {
    readonly resourceName: string;
    readonly keyPath: KeyPath;
    constructor(resourceName: string, keyPath: KeyPath);
    createQuery(key: string): ClientQuery<Model, KeyPath>;
    abstract createCursor(options: QueryOptions<Model>): Promise<number>;
    abstract send<T>(key: ResourceOperationKey, ...args: Array<any>): Promise<T>;
    abstract on(event: string, listener: Function): void;
    abstract off(event: string, listener: Function): void;
    abstract emitSubscribe(type: string, ...args: Array<any>): Promise<UnsubscribeCallback>;
    cursor(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<ClientCursor<Model, KeyPath>>;
    findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Array<any>>;
    findByKey(key: any): Promise<Model | undefined>;
    findOne(criteria: Criteria<Model>, sort?: Sort<Model>): Promise<Model | undefined>;
    upsertOne(object: InsertType<Model, KeyPath>): Promise<Model>;
    insertOne(object: Model): Promise<Model>;
    replaceOne(object: Model): Promise<Model>;
    replaceSeveral(objects: Array<Model>): Promise<Array<Model>>;
    upsertOneWithInfo(object: InsertType<Model, KeyPath>): Promise<UpsertResult<Model>>;
    partialUpdateByKey(key: any, partialUpdate: Update<Model>): Promise<Model>;
    partialUpdateOne(object: Model, partialUpdate: Update<Model>): Promise<Model>;
    partialUpdateMany(criteria: Criteria<Model>, partialUpdate: Update<Model>): Promise<void>;
    deleteByKey(key: any): Promise<void>;
    deleteOne(object: Model): Promise<void>;
    deleteMany(criteria: Criteria<Model>): Promise<void>;
}
export {};
//# sourceMappingURL=AbstractClient.d.ts.map