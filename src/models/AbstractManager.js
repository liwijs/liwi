import EventEmitter from 'events';

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
