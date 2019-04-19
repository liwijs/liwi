import { BaseModel, Criteria, Update } from 'liwi-types';
import AbstractCursor from './AbstractCursor';
export default interface InternalCommonStoreClient<Model extends BaseModel, KeyPath extends string, Cursor extends AbstractCursor<Model, KeyPath>> {
    readonly keyPath: KeyPath;
    findByKey(key: any): Promise<Model | undefined>;
    replaceOne(object: Model): Promise<Model>;
    partialUpdateByKey(key: any, partialUpdate: Update<Model>, criteria?: Criteria<Model>): Promise<Model>;
    deleteByKey(key: any): Promise<void>;
}
//# sourceMappingURL=InternalCommonStoreClient.d.ts.map