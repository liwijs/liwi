import type { UpsertResult, SubscribableStore, QueryParams } from 'liwi-store';
import type { Criteria, Sort, Update, QueryOptions, Transformer, AllowedKeyValue } from 'liwi-types';
import type { Collection } from 'mongodb';
import type { MongoBaseModel, MongoKeyPath, MongoInsertType } from './MongoBaseModel';
import type MongoConnection from './MongoConnection';
import MongoCursor from './MongoCursor';
import MongoQueryCollection from './MongoQueryCollection';
import MongoQuerySingleItem from './MongoQuerySingleItem';
export interface MongoUpsertResult<KeyValue extends AllowedKeyValue, Model extends MongoBaseModel<KeyValue>> extends UpsertResult<Model> {
    object: Model;
    inserted: boolean;
}
export default class MongoStore<Model extends MongoBaseModel<KeyValue>, KeyValue extends AllowedKeyValue = Model[MongoKeyPath]> implements SubscribableStore<MongoKeyPath, KeyValue, Model, MongoInsertType<Model>, MongoConnection> {
    readonly keyPath: MongoKeyPath;
    readonly connection: MongoConnection;
    private _collection;
    constructor(connection: MongoConnection, collectionName: string);
    get collection(): Promise<Collection>;
    createQuerySingleItem<Result extends Record<MongoKeyPath, KeyValue> = Model, Params extends QueryParams<Params> = never>(options: QueryOptions<Model>, transformer?: Transformer<Model, Result>): MongoQuerySingleItem<Model, Params, Result, KeyValue>;
    createQueryCollection<Item extends Record<MongoKeyPath, KeyValue> = Model, Params extends QueryParams<Params> = never>(options: QueryOptions<Model>, transformer?: Transformer<Model, Item>): MongoQueryCollection<Model, Params, Model['_id'], Item>;
    insertOne(object: MongoInsertType<Model>): Promise<Model>;
    replaceOne(object: Model): Promise<Model>;
    upsertOne<K extends keyof MongoInsertType<Model>>(object: Exclude<MongoInsertType<Model>, K>, setOnInsertPartialObject?: Pick<MongoInsertType<Model>, K>): Promise<Model>;
    upsertOneWithInfo<K extends keyof MongoInsertType<Model>>(object: Exclude<MongoInsertType<Model>, K>, setOnInsertPartialObject?: Pick<MongoInsertType<Model>, K>): Promise<MongoUpsertResult<KeyValue, Model>>;
    replaceSeveral(objects: Model[]): Promise<Model[]>;
    partialUpdateByKey(key: any, partialUpdate: Update<Model>, criteria?: Criteria<Model>): Promise<Model>;
    partialUpdateOne(object: Model, partialUpdate: Update<Model>): Promise<Model>;
    partialUpdateMany(criteria: Criteria<Model>, partialUpdate: Update<Model>): Promise<void>;
    deleteByKey(key: any, criteria?: Criteria<Model>): Promise<void>;
    deleteOne(object: Model): Promise<void>;
    deleteMany(selector: Criteria<Model>): Promise<void>;
    cursor<Result = Model>(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<MongoCursor<Model, Result, KeyValue>>;
    findByKey(key: any, criteria?: Criteria<Model>): Promise<Model | undefined>;
    findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Model[]>;
    findOne(criteria: Criteria<Model>, sort?: Sort<Model>): Promise<Model | undefined>;
}
//# sourceMappingURL=MongoStore.d.ts.map