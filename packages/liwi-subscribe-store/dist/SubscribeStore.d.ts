import { Store as StoreInterface, AbstractConnection, UpsertResult, SubscribableStoreQuery, AbstractStoreCursor, SubscribableStore } from 'liwi-store';
import { BaseModel, InsertType, Update, Criteria, Sort, QueryOptions, Transformer, AllowedKeyValue } from 'liwi-types';
export declare type Actions<Model> = {
    type: 'inserted';
    next: Model[];
} | {
    type: 'updated';
    changes: [Model, Model][];
} | {
    type: 'deleted';
    prev: Model[];
};
export declare type Listener<Model> = (action: Actions<Model>) => unknown;
export default class SubscribeStore<KeyPath extends string, KeyValue extends AllowedKeyValue, Model extends BaseModel & Record<KeyPath, KeyValue>, ModelInsertType extends InsertType<Model, KeyPath>, Connection extends AbstractConnection, Store extends SubscribableStore<KeyPath, KeyValue, Model, ModelInsertType, Connection>> implements StoreInterface<KeyPath, KeyValue, Model, ModelInsertType, Connection> {
    private readonly store;
    private readonly listeners;
    readonly keyPath: KeyPath;
    constructor(store: Store);
    get connection(): Connection;
    subscribe(callback: Listener<Model>): () => void;
    callSubscribed(action: Actions<Model>): void;
    createQuerySingleItem<Result extends Record<KeyPath, KeyValue>>(options: QueryOptions<Model>, transformer?: Transformer<Model, Result>): SubscribableStoreQuery<SubscribableStore<KeyPath, KeyValue, Model, ModelInsertType, Connection>, Result, KeyValue>;
    createQueryCollection<Item extends Record<KeyPath, KeyValue>>(options: QueryOptions<Model>, transformer?: Transformer<Model, Item>): SubscribableStoreQuery<SubscribableStore<KeyPath, KeyValue, Model, ModelInsertType, Connection>, Item[], KeyValue>;
    findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Model[]>;
    findByKey(key: any, criteria?: Criteria<Model>): Promise<Model | undefined>;
    findOne(criteria: Criteria<Model>, sort?: Sort<Model>): Promise<Model | undefined>;
    insertOne(object: ModelInsertType): Promise<Model>;
    replaceOne(object: Model): Promise<Model>;
    replaceSeveral(objects: Model[]): Promise<Model[]>;
    upsertOne<K extends keyof ModelInsertType>(object: Exclude<ModelInsertType, K>, setOnInsertPartialObject?: Pick<ModelInsertType, K>): Promise<Model>;
    upsertOneWithInfo<K extends keyof ModelInsertType>(object: Exclude<ModelInsertType, K>, setOnInsertPartialObject?: Pick<ModelInsertType, K>): Promise<UpsertResult<Model>>;
    partialUpdateByKey(key: any, partialUpdate: Update<Model>, criteria?: Criteria<Model>): Promise<Model>;
    partialUpdateOne(object: Model, partialUpdate: Update<Model>): Promise<Model>;
    partialUpdateMany(criteria: Criteria<Model>, partialUpdate: Update<Model>): Promise<void>;
    deleteByKey(key: any, criteria?: Criteria<Model>): Promise<void>;
    deleteOne(object: Model): Promise<void>;
    deleteMany(criteria: Criteria<Model>): Promise<void>;
    cursor<Result = Model>(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<AbstractStoreCursor<any, KeyValue, Model, Result>>;
}
//# sourceMappingURL=SubscribeStore.d.ts.map