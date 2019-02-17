import { BaseModel } from 'liwi-types';
import { AbstractQuery, Store as StoreInterface } from 'liwi-store';
import SubscribeStore from './SubscribeStore';

export default abstract class AbstractSubscribeQuery<
  Model extends BaseModel,
  Store extends StoreInterface<Model, any, any, any>,
  Transformed = Model
> extends AbstractQuery<Transformed> {
  private _subscribeStore?: SubscribeStore<Model, any, any, any, any>;

  setSubscribeStore(store: SubscribeStore<Model, any, any, any, any>) {
    this._subscribeStore = store;
  }

  getSubscribeStore(): SubscribeStore<Model, any, any, any, any> {
    if (!this._subscribeStore) {
      throw new Error('_subscribeStore is not initialized');
    }
    return this._subscribeStore;
  }
}
