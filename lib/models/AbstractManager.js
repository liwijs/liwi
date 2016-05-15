'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let AbstractManager = class AbstractManager extends _events2.default {
    /**
     * @param {Store} store
    */

    constructor(store) {
        super();
        this._store = store;
    }

    /**
     * @member {Store} store
    */get store() {
        return this._store;
    }

};
exports.default = AbstractManager;
//# sourceMappingURL=AbstractManager.js.map