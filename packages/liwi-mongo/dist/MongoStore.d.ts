import { UpsertResult, Store } from 'liwi-store';
import { Criteria, Sort, Update, QueryOptions, Transformer, AllowedKeyValue } from 'liwi-types';
import { Collection } from 'mongodb';
import { MongoBaseModel, MongoKeyPath, MongoInsertType } from './MongoBaseModel';
import MongoConnection from './MongoConnection';
import MongoCursor from './MongoCursor';
import MongoQueryCollection from './MongoQueryCollection';
import MongoQuerySingleItem from './MongoQuerySingleItem';
export interface MongoUpsertResult<KeyValue extends AllowedKeyValue, Model extends MongoBaseModel<KeyValue>> extends UpsertResult<Model> {
    object: Model;
    inserted: boolean;
}
export default class MongoStore<Model extends MongoBaseModel<KeyValue>, KeyValue extends AllowedKeyValue = Model[MongoKeyPath], ModelInsertType extends MongoInsertType<Model> = MongoInsertType<Model>> implements Store<MongoKeyPath, KeyValue, Model, MongoInsertType<Model>, MongoConnection> {
    readonly keyPath: MongoKeyPath;
    readonly connection: MongoConnection;
    private _collection;
    constructor(connection: MongoConnection, collectionName: string);
    get collection(): Promise<Collection>;
    createQuerySingleItem<Result extends Record<MongoKeyPath, KeyValue> = Model>(options: QueryOptions<Model>, transformer?: Transformer<Model, Result>): MongoQuerySingleItem<Model, Result, KeyValue, MongoInsertType<Model>>;
    createQueryCollection<Item extends Record<MongoKeyPath, KeyValue> = Model>(options: QueryOptions<Model>, transformer?: Transformer<Model, Item>): MongoQueryCollection<Model, Model['_id'], MongoInsertType<Model>, Item>;
    insertOne(object: MongoInsertType<Model>): Promise<Model>;
    replaceOne(object: Model): Promise<Model>;
    upsertOne(object: MongoInsertType<Model>): Promise<Model>;
    upsertOneWithInfo(object: MongoInsertType<Model>): Promise<MongoUpsertResult<KeyValue, Model>>;
    replaceSeveral(objects: Model[]): Promise<Model[]>;
    partialUpdateByKey(key: any, partialUpdate: Update<Model>, criteria?: Criteria<Model>): Promise<Model>;
    partialUpdateOne(object: Model, partialUpdate: Update<Model>): Promise<Model>;
    partialUpdateMany(criteria: Criteria<Model>, partialUpdate: Update<Model>): Promise<void>;
    deleteByKey(key: any, criteria?: Criteria<Model>): Promise<void>;
    deleteOne(object: Model): Promise<void>;
    deleteMany(selector: Criteria<Model>): Promise<void>;
    cursor<Result = Model>(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<MongoCursor<Model, Result, KeyValue, ModelInsertType>>;
    findByKey(key: any, criteria?: Criteria<Model>): Promise<Model | undefined>;
    findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Model[]>;
    findOne(criteria: Criteria<Model>, sort?: Sort<Model>): Promise<Model | undefined>;
}
//# sourceMappingURL=MongoStore.d.ts.map