import { BaseModel, QueryOptions } from 'liwi-types';
import AbstractConnection from './AbstractConnection';
import AbstractCursor from './AbstractCursor';
import AbstractQuery from './AbstractQuery';
import InternalCommonStoreClient from './InternalCommonStoreClient';
export interface UpsertResult<Model extends BaseModel> {
    object: Model;
    inserted: boolean;
}
export default interface Store<Model extends BaseModel, KeyPath extends string, Connection extends AbstractConnection, Cursor extends AbstractCursor<Model, KeyPath, any>, Query extends AbstractQuery<Model>> extends InternalCommonStoreClient<Model, KeyPath, Cursor> {
    readonly keyPath: KeyPath;
    readonly connection: Connection;
    createQuery(options: QueryOptions<Model>): Query;
}
//# sourceMappingURL=Store.d.ts.map