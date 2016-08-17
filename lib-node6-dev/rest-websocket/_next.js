'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = init;

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MAX_OPENED_CURSORS = 5;
const logger = new _nightingaleLogger2.default('liwi.rest-websocket');

function init(io, restService) {
    io.on('connection', socket => {
        let openCursors = new Map();
        let timeouts = new Map();
        let activeListeners = new Map();

        const closeCursor = id => {
            clearTimeout(timeouts[id]);
            timeouts.delete(id);
            openCursors[id].close();
            openCursors.delete(id);
        };

        socket.on('disconnect', () => {
            openCursors.forEach(cursor => {
                return cursor.close();
            });
            timeouts.forEach(timeout => {
                return clearTimeout(timeout);
            });
            activeListeners.forEach(listener => {
                return listener.close();
            });

            openCursors = timeouts = activeListeners = null;
        });

        let nextIdCursor = 1;

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
                case 'createCursor':
                    {
                        if (openCursors.size > MAX_OPENED_CURSORS) return callback('too many cursors');

                        const id = nextIdCursor++;

                        var _args = _slicedToArray(args, 1);

                        const options = _args[0];

                        const cursor = restService.createCursor(restName, options);
                        if (!cursor) return callback('failed to create cursor');

                        timeouts.set(id, setTimeout(() => {
                            logger.warn('socket closed by timeout', { id, restName });
                            closeCursor(id);
                        }));

                        return callback(null, id);
                    }

                case 'cursor toArray':
                    {
                        var _args2 = _slicedToArray(args, 1);

                        const options = _args2[0];

                        return restService.createCursor(restName, options).then(cursor => {
                            return cursor.toArray();
                        }).then(results => {
                            return callback(null, results);
                        }).catch(err => {
                            return callback(err.message);
                        });
                    }

                case 'cursor':
                    {
                        var _args3 = _slicedToArray(args, 2);

                        var _args3$ = _args3[0];
                        const typeCursorAction = _args3$.type;
                        const idCursor = _args3$.id;
                        const cursorArgs = _args3[1];


                        const cursor = openCursors.get(idCursor);
                        if (!cursor) return callback(`failed to find cursor "${ idCursor }"`);
                        switch (typeCursorAction) {
                            case 'close':
                                closeCursor(idCursor);
                                return callback();

                            case 'advance':
                            case 'next':
                            case 'count':
                                return cursor[type](...cursorArgs).then(result => {
                                    return callback(null, result);
                                }).catch(err => {
                                    return callback(err.message || err);
                                });
                            /* cursor.next().then((key) => {
                                if (!key) return callback(null);
                                return cursor.result();
                            }).then(result => {
                                    response(null, restService.transform(data));
                                });
                            }, () => {
                                response(null);
                            }); */

                            default:
                                callback(`Unknown command: "${ type }"`);
                        }

                        break;
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
                    return restService[type](restName, ...args).then(result => {
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
//# sourceMappingURL=_next.js.map