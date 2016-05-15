'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let AbstractStore = class AbstractStore {
    /**
     * @param {AbstractConnection} connection
    */
    constructor(connection) {
        (0, _assert2.default)(connection);
        this._connection = connection;
    }

    /**
     * @member {Connection} connection
    */get connection() {
        return this._connection;
    }
};
exports.default = AbstractStore;
//# sourceMappingURL=AbstractStore.js.map