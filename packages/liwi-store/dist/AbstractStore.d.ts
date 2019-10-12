import { BaseModel, InsertType, Update, Criteria, Sort, QueryOptions, Transformer } from 'liwi-types';
import Store, { UpsertResult } from './Store';
import AbstractConnection from './AbstractConnection';
import AbstractStoreCursor from './AbstractStoreCursor';
import AbstractQuery from './AbstractQuery';
export default abstract class AbstractStore<Model extends BaseModel, KeyPath extends string, Connection extends AbstractConnection, Cursor extends AbstractStoreCursor<Model, KeyPath, any>> implements Store<Model, KeyPath, Connection, Cursor> {
    private readonly _connection;
    readonly keyPath: KeyPath;
    constructor(connection: Connection, keyPath: KeyPath);
    readonly connection: Connection;
    abstract createQuery<Transformed>(options: QueryOptions<Model>, transformer?: Transformer<Model, Transformed>): AbstractQuery<Transformed>;
    findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Model[]>;
    abstract findByKey(key: any, criteria?: Criteria<Model>): Promise<Model | undefined>;
    abstract findOne(criteria: Criteria<Model>, sort?: Sort<Model>): Promise<Model | undefined>;
    abstract cursor(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Cursor>;
    abstract insertOne(object: InsertType<Model, KeyPath>): Promise<Model>;
    abstract replaceOne(object: Model): Promise<Model>;
    abstract replaceSeveral(objects: Model[]): Promise<Model[]>;
    upsertOne(object: InsertType<Model, KeyPath>): Promise<Model>;
    abstract upsertOneWithInfo(object: InsertType<Model, KeyPath>): Promise<UpsertResult<Model>>;
    abstract partialUpdateByKey(key: any, partialUpdate: Update<Model>, criteria?: Criteria<Model>): Promise<Model>;
    abstract partialUpdateOne(object: Model, partialUpdate: Update<Model>): Promise<Model>;
    abstract partialUpdateMany(criteria: Criteria<Model>, partialUpdate: Update<Model>): Promise<void>;
    abstract deleteByKey(key: any, criteria?: Criteria<Model>): Promise<void>;
    deleteOne(object: Model): Promise<void>;
    abstract deleteMany(selector: Criteria<Model>): Promise<void>;
}
//# sourceMappingURL=AbstractStore.d.ts.map