import { BaseModel, Criteria, InsertType, Sort, Update } from 'liwi-types';
import AbstractCursor from './AbstractCursor';
export interface UpsertResult<Model extends BaseModel> {
    object: Model;
    inserted: boolean;
}
export default interface InternalCommonStoreClient<Model extends BaseModel, KeyPath extends string, Cursor extends AbstractCursor<Model, KeyPath, any>> {
    readonly keyPath: KeyPath;
    findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<any[]>;
    findByKey(key: any): Promise<Model | undefined>;
    findOne(criteria: Criteria<Model>, sort?: Sort<Model>): Promise<Model | undefined>;
    cursor(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Cursor>;
    insertOne(object: InsertType<Model, KeyPath>): Promise<Model>;
    replaceOne(object: Model): Promise<Model>;
    replaceSeveral(objects: Model[]): Promise<Model[]>;
    upsertOne(object: InsertType<Model, KeyPath>): Promise<Model>;
    upsertOneWithInfo(object: InsertType<Model, KeyPath>): Promise<UpsertResult<Model>>;
    partialUpdateByKey(key: any, partialUpdate: Update<Model>): Promise<Model>;
    partialUpdateOne(object: Model, partialUpdate: Update<Model>): Promise<Model>;
    partialUpdateMany(criteria: Criteria<Model>, partialUpdate: Update<Model>): Promise<void>;
    deleteByKey(key: any): Promise<void>;
    deleteOne(object: Model): Promise<void>;
    deleteMany(selector: Criteria<Model>): Promise<void>;
}
//# sourceMappingURL=InternalCommonStoreClient.d.ts.map