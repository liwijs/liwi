import { Store as StoreInterface, AbstractConnection, AbstractCursor, UpsertResult } from 'liwi-store';
import { BaseModel, InsertType, Update, Criteria, Sort } from 'liwi-types';
import AbstractSubscribeQuery from './AbstractSubscribeQuery';
export declare type Actions<Model> = {
    type: 'inserted';
    next: Array<Model>;
} | {
    type: 'updated';
    prev: Array<Model>;
    next: Array<Model>;
} | {
    type: 'deleted';
    prev: Array<Model>;
};
export declare type Listener<Model> = (action: Actions<Model>) => void;
export default class SubscribeStore<Model extends BaseModel, KeyPath extends string, Connection extends AbstractConnection, Cursor extends AbstractCursor<Model, KeyPath, any>, Store extends StoreInterface<Model, KeyPath, Connection, Cursor, any>, Query extends AbstractSubscribeQuery<Model, StoreInterface<Model, KeyPath, Connection, Cursor, any>>> implements StoreInterface<Model, KeyPath, Connection, Cursor, Query> {
    private store;
    private listeners;
    constructor(store: Store);
    readonly keyPath: KeyPath;
    readonly connection: Connection;
    subscribe(callback: Listener<Model>): () => boolean;
    callSubscribed(action: Actions<Model>): void;
    createQuery(criteria: any): Query;
    findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Array<Model>>;
    findByKey(key: any): Promise<Model | undefined>;
    findOne(criteria: Criteria<Model>, sort?: Sort<Model>): Promise<Model | undefined>;
    insertOne(object: InsertType<Model, KeyPath>): Promise<Model>;
    replaceOne(object: Model): Promise<Model>;
    replaceSeveral(objects: Array<Model>): Promise<Array<Model>>;
    upsertOne(object: InsertType<Model, KeyPath>): Promise<Model>;
    upsertOneWithInfo(object: InsertType<Model, KeyPath>): Promise<UpsertResult<Model>>;
    partialUpdateByKey(key: any, partialUpdate: Update<Model>): Promise<Model>;
    partialUpdateOne(object: Model, partialUpdate: Update<Model>): Promise<Model>;
    partialUpdateMany(criteria: Criteria<Model>, partialUpdate: Update<Model>): Promise<void>;
    deleteByKey(key: any): Promise<void>;
    deleteOne(object: Model): Promise<void>;
    deleteMany(criteria: Criteria<Model>): Promise<void>;
    cursor(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Cursor>;
}
//# sourceMappingURL=SubscribeStore.d.ts.map