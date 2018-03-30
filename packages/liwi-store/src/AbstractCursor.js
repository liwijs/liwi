/* eslint-disable no-await-in-loop */
import type { ResultType } from './types';

export default class AbstractCursor<Store> {
  key: any;

  constructor(store: Store) {
    this._store = store;
  }

  get store(): Store {
    return this._store;
  }

  close() {
    throw new Error('close() missing implementation');
  }

  next(): Promise<any> {
    throw new Error('next() missing implementation');
  }

  nextResult(): Promise<any> {
    return this.next().then(() => this.result());
  }

  limit(newLimit: number): Promise<void> {
    throw new Error('limit() missing implementation');
  }

  count(applyLimit: boolean = false) {
    throw new Error('count() missing implementation');
  }

  result(): Promise<ResultType> {
    return this.store.findByKey(this.key);
  }

  delete(): Promise<void> {
    return this.store.deleteByKey(this.key);
  }

  async forEachKeys(callback: Function): Promise<void> {
    while (true) {
      const key = await this.next();
      if (!key) return;

      await callback(key);
    }
  }

  forEach(callback): Promise<void> {
    return this.forEachKeys(() => this.result().then(result => callback(result)));
  }

  *keysIterator() {
    while (true) {
      yield this.next();
    }
  }

  *[Symbol.iterator]() {
    // eslint-disable-next-line no-restricted-syntax
    for (const keyPromise of this.keysIterator()) {
      yield keyPromise.then(key => key && this.result());
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
