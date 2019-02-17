import { Collection } from 'mongodb';
import { AbstractStore, UpsertResult } from 'liwi-store';
import { BaseModel, InsertType, Criteria, Sort, Update, QueryOptions, Transformer } from 'liwi-types';
import MongoConnection from './MongoConnection';
import MongoCursor from './MongoCursor';
import MongoQuery from './MongoQuery';
import { MongoKeyPath } from '.';
export declare type MongoKeyPath = '_id';
export interface MongoModel extends BaseModel {
    _id: string;
}
export declare type MongoInsertType<Model extends MongoModel> = InsertType<Model, MongoKeyPath>;
export interface MongoUpsertResult<Model extends MongoModel> extends UpsertResult<Model> {
    object: Model;
    inserted: boolean;
}
export default class MongoStore<Model extends MongoModel> extends AbstractStore<Model, MongoKeyPath, MongoConnection, MongoCursor<Model>> {
    private _collection;
    constructor(connection: MongoConnection, collectionName: string);
    readonly collection: Promise<Collection>;
    createQuery<Transformed>(options: QueryOptions<Model>, transformer?: Transformer<Model, Transformed>): MongoQuery<Model, Transformed>;
    insertOne(object: MongoInsertType<Model>): Promise<Model>;
    replaceOne(object: Model): Promise<Model>;
    upsertOneWithInfo(object: MongoInsertType<Model>): Promise<MongoUpsertResult<Model>>;
    replaceSeveral(objects: Model[]): Promise<Model[]>;
    partialUpdateByKey(key: any, partialUpdate: Update<Model>): Promise<Model>;
    partialUpdateOne(object: Model, partialUpdate: Update<Model>): Promise<Model>;
    partialUpdateMany(criteria: Criteria<Model>, partialUpdate: Update<Model>): Promise<void>;
    deleteByKey(key: any): Promise<void>;
    deleteMany(selector: Criteria<Model>): Promise<void>;
    cursor(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<MongoCursor<Model>>;
    findByKey(key: any): Promise<Model | undefined>;
    findOne(criteria: Criteria<Model>, sort?: Sort<Model>): Promise<Model | undefined>;
}
//# sourceMappingURL=MongoStore.d.ts.map