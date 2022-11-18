import AbstractCursor from './AbstractCursor';
import type { InternalCommonStoreClient } from './InternalCommonStoreClient';
import type { BaseModel, AllowedKeyValue } from './types';
export default abstract class AbstractStoreCursor<Store extends InternalCommonStoreClient<Model>, KeyValue extends AllowedKeyValue, Model extends BaseModel, Result extends Partial<Model> = Model> extends AbstractCursor<Model, Result> {
    key: KeyValue | undefined;
    protected _store: Store;
    constructor(store: Store);
    get store(): Store;
    overrideStore(store: Store): void;
    result(): Promise<Result>;
    delete(): Promise<void>;
}
//# sourceMappingURL=AbstractStoreCursor.d.ts.map