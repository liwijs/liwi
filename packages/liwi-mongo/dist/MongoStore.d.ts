import { Collection } from 'mongodb';
import { AbstractStore } from 'liwi-store';
import { BaseModel, InsertType, Criteria, Sort, Update } from 'liwi-types';
import MongoConnection from './MongoConnection';
import MongoCursor from './MongoCursor';
export interface MongoModel extends BaseModel {
    _id: string;
}
export declare type MongoKeyPath = '_id';
export declare type MongoInsertType<Model extends MongoModel> = InsertType<Model, MongoKeyPath>;
export default class MongoStore<Model extends MongoModel> extends AbstractStore<Model, MongoKeyPath, MongoConnection, MongoCursor<Model>> {
    _collection: Collection | Promise<Collection>;
    constructor(connection: MongoConnection, collectionName: string);
    readonly collection: Promise<Collection>;
    insertOne(object: MongoInsertType<Model>): Promise<Model>;
    replaceOne(object: Model): Promise<Model>;
    upsertOne(object: MongoInsertType<Model>): Promise<Model>;
    replaceSeveral(objects: Array<Model>): Promise<Array<Model>>;
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