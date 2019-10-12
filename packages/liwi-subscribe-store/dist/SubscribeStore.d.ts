import { Store as StoreInterface, AbstractConnection, AbstractStoreCursor, UpsertResult } from 'liwi-store';
import { BaseModel, InsertType, Update, Criteria, Sort, QueryOptions, Transformer } from 'liwi-types';
import AbstractSubscribeQuery from './AbstractSubscribeQuery';
export declare type Actions<Model> = {
    type: 'inserted';
    next: Model[];
} | {
    type: 'updated';
    prev: Model[];
    next: Model[];
} | {
    type: 'deleted';
    prev: Model[];
};
export declare type Listener<Model> = (action: Actions<Model>) => void;
export default class SubscribeStore<Model extends BaseModel, KeyPath extends string, Connection extends AbstractConnection, Cursor extends AbstractStoreCursor<Model, KeyPath, any>, Store extends StoreInterface<Model, KeyPath, Connection, Cursor>> implements StoreInterface<Model, KeyPath, Connection, Cursor> {
    private readonly store;
    private readonly listeners;
    constructor(store: Store);
    readonly keyPath: KeyPath;
    readonly connection: Connection;
    subscribe(callback: Listener<Model>): () => boolean;
    callSubscribed(action: Actions<Model>): void;
    createQuery<Transformed>(options: QueryOptions<Model>, transformer?: Transformer<Model, Transformed>): AbstractSubscribeQuery<Model, Store, Transformed>;
    findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Model[]>;
    findByKey(key: any, criteria?: Criteria<Model>): Promise<Model | undefined>;
    findOne(criteria: Criteria<Model>, sort?: Sort<Model>): Promise<Model | undefined>;
    insertOne(object: InsertType<Model, KeyPath>): Promise<Model>;
    replaceOne(object: Model): Promise<Model>;
    replaceSeveral(objects: Model[]): Promise<Model[]>;
    upsertOne(object: InsertType<Model, KeyPath>): Promise<Model>;
    upsertOneWithInfo(object: InsertType<Model, KeyPath>): Promise<UpsertResult<Model>>;
    partialUpdateByKey(key: any, partialUpdate: Update<Model>, criteria?: Criteria<Model>): Promise<Model>;
    partialUpdateOne(object: Model, partialUpdate: Update<Model>): Promise<Model>;
    partialUpdateMany(criteria: Criteria<Model>, partialUpdate: Update<Model>): Promise<void>;
    deleteByKey(key: any, criteria?: Criteria<Model>): Promise<void>;
    deleteOne(object: Model): Promise<void>;
    deleteMany(criteria: Criteria<Model>): Promise<void>;
    cursor(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Cursor>;
}
//# sourceMappingURL=SubscribeStore.d.ts.map