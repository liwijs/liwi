'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AbstractManager extends _events2.default {

    constructor(store) {
        super();
        this._store = store;
    }

    get store() {
        return this._store;
    }
}
exports.default = AbstractManager;
//# sourceMappingURL=AbstractManager.js.map