// eslint-disable-next-line no-unused-vars
import AbstractStore from './AbstractStore';

export default class AbstractQuery<Store: AbstractStore> {
  store: Store;
  queryCallback: Function;

  constructor(store, queryCallback) {
    this.store = store;
    this.queryCallback = queryCallback;
  }

}
