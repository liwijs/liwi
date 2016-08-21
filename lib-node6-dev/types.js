"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

const CursorInterface = exports.CursorInterface = function () {
    function CursorInterface(input) {
        return input != null && StoreInterface(input.store) && typeof input.close === 'function' && typeof input.next === 'function' && typeof input.nextResult === 'function' && typeof input.limit === 'function' && typeof input.count === 'function' && typeof input.result === 'function' && typeof input.delete === 'function' && typeof input.forEachKeys === 'function' && typeof input.forEach === 'function';
    }

    ;
    Object.defineProperty(CursorInterface, Symbol.hasInstance, {
        value: function value(input) {
            return CursorInterface(input);
        }
    });
    return CursorInterface;
}();

const StoreInterface = exports.StoreInterface = function () {
    function StoreInterface(input) {
        return input != null && typeof input.insertOne === 'function' && typeof input.updateOne === 'function' && typeof input.upsertOne === 'function' && typeof input.updateSeveral === 'function' && typeof input.partialUpdateByKey === 'function' && typeof input.partialUpdateOne === 'function' && typeof input.partialUpdateMany === 'function' && typeof input.deleteByKey === 'function' && typeof input.cursor === 'function' && typeof input.findByKey === 'function' && typeof input.findOne === 'function';
    }

    ;
    Object.defineProperty(StoreInterface, Symbol.hasInstance, {
        value: function value(input) {
            return StoreInterface(input);
        }
    });
    return StoreInterface;
}();
//# sourceMappingURL=types.js.map