var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import Logger from 'nightingale-logger';

var logger = new Logger('liwi.rest-websocket');

export default function init(io, restService) {
    io.on('connection', socket => {
        socket.on('rest', (_arg, args, callback) => {
            if (!Array.isArray(args)) {
                throw new TypeError('Value of argument "args" violates contract.\n\nExpected:\nArray\n\nGot:\n' + _inspect(args));
            }

            if (!(typeof callback === 'function')) {
                throw new TypeError('Value of argument "callback" violates contract.\n\nExpected:\nFunction\n\nGot:\n' + _inspect(callback));
            }

            var _arg2 = _arg;
            var type = _arg2.type;
            var restName = _arg2.restName;

            if (!(typeof type === 'string' && typeof restName === 'string')) {
                throw new TypeError('Value of "{\n  type,\n  restName\n}" violates contract.\n\nExpected:\n{\n  type: string;\n  restName: string;\n}\n\nGot:\n' + _inspect({ type, restName }));
            }

            logger.info('rest', { type, restName, args });
            switch (type) {
                case 'cursor toArray':
                    {
                        var _args = _slicedToArray(args, 1);

                        var options = _args[0];

                        return restService.createCursor(restName, options).then(cursor => {
                            return cursor.toArray();
                        }).then(results => {
                            return callback(null, results);
                        }).catch(err => {
                            return callback(err.message);
                        });
                    }

                case 'insertOne':
                case 'updateOne':
                case 'updateSeveral':
                case 'partialUpdateByKey':
                case 'partialUpdateOne':
                case 'partialUpdateMany':
                case 'deleteByKey':
                case 'deleteOne':
                case 'findOne':
                    return restService.get(type)(restName, ...args).then(result => {
                        return callback(null, result);
                    }).catch(err => {
                        return callback(err.message || err);
                    });

                default:
                    callback(`Unknown command: "${ type }"`);
            }
        });
    });
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
//# sourceMappingURL=index.js.map