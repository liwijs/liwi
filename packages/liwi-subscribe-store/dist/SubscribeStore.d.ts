import type { Store as StoreInterface, AbstractConnection, UpsertResult, SubscribableStoreQuery, AbstractStoreCursor, SubscribableStore, QueryParams, UpsertPartialObject } from 'liwi-store';
import type { BaseModel, InsertType, Update, Criteria, Sort, QueryOptions, Transformer, AllowedKeyValue, OptionalBaseModelKeysForInsert } from 'liwi-types';
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
export default class SubscribeStore<KeyPath extends keyof Model, KeyValue extends AllowedKeyValue, Model extends BaseModel & Record<KeyPath, KeyValue>, ModelInsertType extends InsertType<Model, KeyPath>, Connection extends AbstractConnection, Store extends SubscribableStore<KeyPath, KeyValue, Model, ModelInsertType, Connection>> implements StoreInterface<KeyPath, KeyValue, Model, ModelInsertType, Connection> {
    private readonly store;
    private readonly listeners;
    readonly keyPath: KeyPath;
    constructor(store: Store);
    get connection(): Connection;
    subscribe(callback: Listener<Model>): () => void;
    callSubscribed(action: Actions<Model>): void;
    createQuerySingleItem<Result extends Record<KeyPath, KeyValue>, Params extends QueryParams<Params>>(options: QueryOptions<Model>, transformer?: Transformer<Model, Result>): SubscribableStoreQuery<KeyPath, KeyValue, Model, SubscribableStore<KeyPath, KeyValue, Model, ModelInsertType, Connection>, Result, Params>;
    createQueryCollection<Item extends Record<KeyPath, KeyValue>, Params extends QueryParams<Params>>(options: QueryOptions<Model>, transformer?: Transformer<Model, Item>): SubscribableStoreQuery<KeyPath, KeyValue, Model, SubscribableStore<KeyPath, KeyValue, Model, ModelInsertType, Connection>, Item[], Params>;
    findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Model[]>;
    findByKey(key: KeyValue, criteria?: Criteria<Model>): Promise<Model | undefined>;
    findOne(criteria: Criteria<Model>, sort?: Sort<Model>): Promise<Model | undefined>;
    insertOne(object: ModelInsertType): Promise<Model>;
    replaceOne(object: Model): Promise<Model>;
    replaceSeveral(objects: Model[]): Promise<Model[]>;
    upsertOne<K extends Exclude<keyof Model, KeyPath | OptionalBaseModelKeysForInsert>>(object: UpsertPartialObject<KeyPath, KeyValue, Model, K>, setOnInsertPartialObject?: Update<Model>['$setOnInsert']): Promise<Model>;
    upsertOneWithInfo<K extends Exclude<keyof Model, KeyPath | OptionalBaseModelKeysForInsert>>(object: UpsertPartialObject<KeyPath, KeyValue, Model, K>, setOnInsertPartialObject?: Update<Model>['$setOnInsert']): Promise<UpsertResult<Model>>;
    partialUpdateByKey(key: KeyValue, partialUpdate: Update<Model>, criteria?: Criteria<Model>): Promise<Model>;
    partialUpdateOne(object: Model, partialUpdate: Update<Model>): Promise<Model>;
    partialUpdateMany(criteria: Criteria<Model>, partialUpdate: Update<Model>): Promise<void>;
    deleteByKey(key: KeyValue, criteria?: Criteria<Model>): Promise<void>;
    deleteOne(object: Model): Promise<void>;
    deleteMany(criteria: Criteria<Model>): Promise<void>;
    count(criteria?: Criteria<Model>): Promise<number>;
    cursor<Result = Model>(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<AbstractStoreCursor<any, KeyValue, Model, Result>>;
}
//# sourceMappingURL=SubscribeStore.d.ts.map