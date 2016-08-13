export default class RestResourceService {
    constructor(store) {
        this.store = store;
    }

    criteria(connectedUser, criteria) {
        if (!(connectedUser == null || connectedUser instanceof Object)) {
            throw new TypeError("Value of argument \"connectedUser\" violates contract.\n\nExpected:\n?Object\n\nGot:\n" + _inspect(connectedUser));
        }

        if (!(criteria instanceof Object)) {
            throw new TypeError("Value of argument \"criteria\" violates contract.\n\nExpected:\nObject\n\nGot:\n" + _inspect(criteria));
        }

        return {};
    }

    sort(connectedUser, sort) {
        if (!(connectedUser == null || connectedUser instanceof Object)) {
            throw new TypeError("Value of argument \"connectedUser\" violates contract.\n\nExpected:\n?Object\n\nGot:\n" + _inspect(connectedUser));
        }

        if (!(sort instanceof Object)) {
            throw new TypeError("Value of argument \"sort\" violates contract.\n\nExpected:\nObject\n\nGot:\n" + _inspect(sort));
        }

        return {};
    }

    transform(result) {
        if (!(result instanceof Object)) {
            throw new TypeError("Value of argument \"result\" violates contract.\n\nExpected:\nObject\n\nGot:\n" + _inspect(result));
        }

        return result;
    }
}

function _inspect(input, depth) {
    var maxDepth = 4;
    var maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input;
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(item => _inspect(item, depth) === first)) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if (typeof _ret === "object") return _ret.v;
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        var indent = '  '.repeat(depth - 1);
        var entries = keys.slice(0, maxKeys).map(key => {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}
//# sourceMappingURL=RestResource.js.map