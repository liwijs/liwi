import { BaseModel, InsertType, Update, Criteria, Sort } from 'liwi-types';
import AbstractConnection from './AbstractConnection';
import AbstractCursor from './AbstractCursor';
export default abstract class AbstractStore<Model extends BaseModel, KeyPath extends string, Connection extends AbstractConnection, Cursor extends AbstractCursor<Model, KeyPath, any>> {
    _connection: Connection;
    readonly keyPath: KeyPath;
    constructor(connection: Connection, keyPath: KeyPath);
    readonly connection: Connection;
    findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Array<any>>;
    abstract insertOne(object: InsertType<Model, KeyPath>): Promise<Model>;
    abstract replaceOne(object: Model): Promise<Model>;
    abstract upsertOne(object: InsertType<Model, KeyPath>): Promise<Model | Model>;
    abstract partialUpdateByKey(key: any, partialUpdate: Update<Model>): Promise<Model>;
    abstract partialUpdateOne(object: Model, partialUpdate: Update<Model>): Promise<Model>;
    abstract partialUpdateMany(criteria: Criteria<Model>, partialUpdate: Update<Model>): Promise<void>;
    abstract deleteByKey(key: any): Promise<void>;
    abstract cursor(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Cursor>;
    abstract findByKey(key: any): Promise<Model | undefined>;
    abstract findOne(criteria: Criteria<Model>, sort?: Sort<Model>): Promise<Model | undefined>;
}
//# sourceMappingURL=AbstractStore.d.ts.map