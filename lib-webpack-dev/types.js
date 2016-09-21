import _t from "tcomb-forked";
export var CursorInterface = _t.interface({
    close: _t.Function,
    next: _t.Function,
    nextResult: _t.Function,
    limit: _t.Function,
    count: _t.Function,
    result: _t.Function,
    delete: _t.Function,
    forEachKeys: _t.Function,
    forEach: _t.Function
}, "CursorInterface");

export var StoreInterface = _t.interface({
    create: _t.Function,
    insertOne: _t.Function,
    replaceOne: _t.Function,
    upsertOne: _t.Function,
    updateSeveral: _t.Function,
    partialUpdateByKey: _t.Function,
    partialUpdateOne: _t.Function,
    partialUpdateMany: _t.Function,
    deleteByKey: _t.Function,
    cursor: _t.Function,
    findAll: _t.Function,
    findByKey: _t.Function,
    findOne: _t.Function
}, "StoreInterface");
//# sourceMappingURL=types.js.map