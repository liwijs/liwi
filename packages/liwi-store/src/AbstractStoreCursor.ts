/* eslint-disable no-await-in-loop */

import { BaseModel } from 'liwi-types';
import AbstractCursor from './AbstractCursor';
import InternalCommonStoreClient from './InternalCommonStoreClient';

export default abstract class AbstractStoreCursor<
  Model extends BaseModel,
  KeyPath extends string,
  Store extends InternalCommonStoreClient<Model, KeyPath, any>,
  Result extends Partial<Model> = Model
> extends AbstractCursor<Model, KeyPath, Result> {
  key: any;

  protected _store: Store;

  constructor(store: Store) {
    super();
    this._store = store;
  }

  get store(): Store {
    return this._store;
  }

  overrideStore(store: Store) {
    this._store = store;
  }

  result(): Promise<Result> {
    if (!this.key) throw new Error('Cannot call result() before next()');
    return (this.store.findByKey(this.key) as unknown) as Promise<Result>;
  }

  delete(): Promise<void> {
    return this.store.deleteByKey(this.key);
  }
}
