"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StoreInterface = exports.CursorInterface = undefined;

var _tcombForked = require("tcomb-forked");

var _tcombForked2 = _interopRequireDefault(_tcombForked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CursorInterface = exports.CursorInterface = _tcombForked2.default.interface({
    close: _tcombForked2.default.Function,
    next: _tcombForked2.default.Function,
    nextResult: _tcombForked2.default.Function,
    limit: _tcombForked2.default.Function,
    count: _tcombForked2.default.Function,
    result: _tcombForked2.default.Function,
    delete: _tcombForked2.default.Function,
    forEachKeys: _tcombForked2.default.Function,
    forEach: _tcombForked2.default.Function
}, "CursorInterface");

const StoreInterface = exports.StoreInterface = _tcombForked2.default.interface({
    create: _tcombForked2.default.Function,
    insertOne: _tcombForked2.default.Function,
    replaceOne: _tcombForked2.default.Function,
    upsertOne: _tcombForked2.default.Function,
    updateSeveral: _tcombForked2.default.Function,
    partialUpdateByKey: _tcombForked2.default.Function,
    partialUpdateOne: _tcombForked2.default.Function,
    partialUpdateMany: _tcombForked2.default.Function,
    deleteByKey: _tcombForked2.default.Function,
    cursor: _tcombForked2.default.Function,
    findAll: _tcombForked2.default.Function,
    findByKey: _tcombForked2.default.Function,
    findOne: _tcombForked2.default.Function
}, "StoreInterface");
//# sourceMappingURL=types.js.map