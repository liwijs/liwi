"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class RestResourceService {
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
exports.default = RestResourceService;

function _inspect(input, depth) {
    const maxDepth = 4;
    const maxKeys = 15;

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
            if (depth > maxDepth) return '[...]';

            const first = _inspect(input[0], depth);

            if (input.every(item => _inspect(item, depth) === first)) {
                return first.trim() + '[]';
            } else {
                return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
            }
        } else {
            return 'Array';
        }
    } else {
        const keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        const indent = '  '.repeat(depth - 1);
        let entries = keys.slice(0, maxKeys).map(key => {
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