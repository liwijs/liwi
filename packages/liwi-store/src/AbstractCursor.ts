/* eslint-disable no-await-in-loop */

import { BaseModel } from 'liwi-types';
import AbstractStore from './AbstractStore';

export default abstract class AbstractCursor<
  Model extends BaseModel,
  KeyPath extends string,
  Store extends AbstractStore<Model, KeyPath, any, any, any>
> {
  key: any;

  protected _store: Store;

  constructor(store: Store) {
    this._store = store;
  }

  get store(): Store {
    return this._store;
  }

  overrideStore(store: Store) {
    this._store = store;
  }

  abstract close(): Promise<void> | void;

  abstract next(): Promise<any>;

  nextResult(): Promise<Model> {
    return this.next().then(() => this.result());
  }

  abstract limit(newLimit: number): Promise<this>;

  abstract count(applyLimit: boolean /*  = false */): Promise<number>;

  abstract toArray(): Promise<Array<Model>>;

  result(): Promise<Model> {
    if (!this.key) throw new Error('Cannot call result() before next()');
    return this.store.findByKey(this.key) as Promise<Model>;
  }

  delete(): Promise<void> {
    return this.store.deleteByKey(this.key);
  }

  async forEachKeys(callback: (key: any) => any): Promise<void> {
    while (true) {
      const key = await this.next();
      if (!key) return;

      await callback(key);
    }
  }

  forEach(callback: (result: Model) => any): Promise<void> {
    return this.forEachKeys(() =>
      this.result().then((result) => callback(result)),
    );
  }

  *keysIterator() {
    while (true) {
      yield this.next();
    }
  }

  *[Symbol.iterator]() {
    // eslint-disable-next-line no-restricted-syntax
    for (const keyPromise of this.keysIterator()) {
      yield keyPromise.then((key) => key && this.result());
    }
  }

  // TODO Symbol.asyncIterator, https://phabricator.babeljs.io/T7356
  /*
    async *keysAsyncIterator() {
        while (true) {
             const key = await this.next();
             if (!key) return;

             yield key;
        }
     }

     async *[Symbol.asyncIterator] {
        for await (let key of this.keysAsyncIterator()) {
            yield await this.result();
        }
     }
     */
}
