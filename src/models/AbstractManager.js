import EventEmitter from 'events';
// import type { StoreInterface } from '../types';

export default class AbstractManager<Store> extends EventEmitter {
  _store: Store;

  constructor(store: Store) {
    super();
    this._store = store;
  }

  get store(): Store {
    return this._store;
  }
}
