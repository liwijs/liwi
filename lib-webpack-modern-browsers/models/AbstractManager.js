import EventEmitter from 'events';

export default class AbstractManager extends EventEmitter {

    constructor(store) {
        super();
        this._store = store;
    }

    get store() {
        return this._store;
    }
}
//# sourceMappingURL=AbstractManager.js.map