import { BaseModel } from 'liwi-types';
import { AbstractQuery, Store as StoreInterface } from 'liwi-store';
import SubscribeStore from './SubscribeStore';
export default abstract class AbstractSubscribeQuery<Model extends BaseModel, Store extends StoreInterface<Model, any, any, any, any>, Transformed = Model> extends AbstractQuery<Transformed> {
    private _subscribeStore?;
    setSubscribeStore(store: SubscribeStore<Model, any, any, any, any, any>): void;
    getSubscribeStore(): SubscribeStore<Model, any, any, any, any, any>;
}
//# sourceMappingURL=AbstractSubscribeQuery.d.ts.map