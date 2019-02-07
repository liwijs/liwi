import { BaseModel } from 'liwi-types';
import AbstractCursor from './AbstractCursor';
import InternalCommonStoreClient from './InternalCommonStoreClient';
export default abstract class AbstractStoreCursor<Model extends BaseModel, KeyPath extends string, Store extends InternalCommonStoreClient<Model, KeyPath, any>> extends AbstractCursor<Model, KeyPath> {
    key: any;
    protected _store: Store;
    constructor(store: Store);
    readonly store: Store;
    overrideStore(store: Store): void;
    result(): Promise<Model>;
    delete(): Promise<void>;
}
//# sourceMappingURL=AbstractStoreCursor.d.ts.map