import { BaseModel, InsertType, Update, Criteria, Sort, QueryOptions } from 'liwi-types';
import Store, { UpsertResult } from './Store';
import AbstractConnection from './AbstractConnection';
import AbstractCursor from './AbstractCursor';
import AbstractQuery from './AbstractQuery';
export default abstract class AbstractStore<Model extends BaseModel, KeyPath extends string, Connection extends AbstractConnection, Cursor extends AbstractCursor<Model, KeyPath, any>, Query extends AbstractQuery<Model>> implements Store<Model, KeyPath, Connection, Cursor, Query> {
    private readonly _connection;
    readonly keyPath: KeyPath;
    constructor(connection: Connection, keyPath: KeyPath);
    readonly connection: Connection;
    abstract createQuery(options: QueryOptions<Model>): Query;
    findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Array<Model>>;
    abstract findByKey(key: any): Promise<Model | undefined>;
    abstract findOne(criteria: Criteria<Model>, sort?: Sort<Model>): Promise<Model | undefined>;
    abstract cursor(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Cursor>;
    abstract insertOne(object: InsertType<Model, KeyPath>): Promise<Model>;
    abstract replaceOne(object: Model): Promise<Model>;
    abstract replaceSeveral(objects: Array<Model>): Promise<Array<Model>>;
    upsertOne(object: InsertType<Model, KeyPath>): Promise<Model>;
    abstract upsertOneWithInfo(object: InsertType<Model, KeyPath>): Promise<UpsertResult<Model>>;
    abstract partialUpdateByKey(key: any, partialUpdate: Update<Model>): Promise<Model>;
    abstract partialUpdateOne(object: Model, partialUpdate: Update<Model>): Promise<Model>;
    abstract partialUpdateMany(criteria: Criteria<Model>, partialUpdate: Update<Model>): Promise<void>;
    abstract deleteByKey(key: any): Promise<void>;
    deleteOne(object: Model): Promise<void>;
    abstract deleteMany(selector: Criteria<Model>): Promise<void>;
}
//# sourceMappingURL=AbstractStore.d.ts.map