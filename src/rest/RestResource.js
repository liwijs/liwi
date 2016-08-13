export default class RestResourceService {
    constructor(store) {
        this.store = store;
    }

    criteria(connectedUser: ?Object, criteria: Object) {
        return {};
    }

    sort(connectedUser: ?Object, sort: Object) {
        return {};
    }

    transform(result: Object) {
        return result;
    }
}
