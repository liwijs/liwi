var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import Logger from 'nightingale-logger';

var MAX_OPENED_CURSORS = 5;
var logger = new Logger('liwi.rest-websocket');

export default function init(io, restService) {
    io.on('connection', function (socket) {
        var openCursors = new Map();
        var timeouts = new Map();
        var activeListeners = new Map();

        var closeCursor = function closeCursor(id) {
            clearTimeout(timeouts[id]);
            timeouts.delete(id);
            openCursors[id].close();
            openCursors.delete(id);
        };

        socket.on('disconnect', function () {
            openCursors.forEach(function (cursor) {
                return cursor.close();
            });
            timeouts.forEach(function (timeout) {
                return clearTimeout(timeout);
            });
            activeListeners.forEach(function (listener) {
                return listener.close();
            });

            openCursors = timeouts = activeListeners = null;
        });

        var nextIdCursor = 1;

        socket.on('rest', function (_arg, args, callback) {
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
                throw new TypeError('Value of "{\n  type,\n  restName\n}" violates contract.\n\nExpected:\n{\n  type: string;\n  restName: string;\n}\n\nGot:\n' + _inspect({ type: type, restName: restName }));
            }

            logger.info('rest', { type: type, restName: restName, args: args });
            switch (type) {
                case 'createCursor':
                    {
                        var _ret = function () {
                            if (openCursors.size > MAX_OPENED_CURSORS) return {
                                    v: callback('too many cursors')
                                };

                            var id = nextIdCursor++;

                            var _args = _slicedToArray(args, 1);

                            var options = _args[0];

                            var cursor = restService.createCursor(restName, options);
                            if (!cursor) return {
                                    v: callback('failed to create cursor')
                                };

                            timeouts.set(id, setTimeout(function () {
                                logger.warn('socket closed by timeout', { id: id, restName: restName });
                                closeCursor(id);
                            }));

                            return {
                                v: callback(null, id)
                            };
                        }();

                        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
                    }

                case 'cursor toArray':
                    {
                        var _args2 = _slicedToArray(args, 1);

                        var _options = _args2[0];

                        return restService.createCursor(restName, _options).then(function (cursor) {
                            return cursor.toArray();
                        }).then(function (results) {
                            return callback(null, results);
                        }).catch(function (err) {
                            return callback(err.message);
                        });
                    }

                case 'cursor':
                    {
                        var _args3 = _slicedToArray(args, 2);

                        var _args3$ = _args3[0];
                        var typeCursorAction = _args3$.type;
                        var idCursor = _args3$.id;
                        var cursorArgs = _args3[1];


                        var _cursor = openCursors.get(idCursor);
                        if (!_cursor) return callback('failed to find cursor "' + idCursor + '"');
                        switch (typeCursorAction) {
                            case 'close':
                                closeCursor(idCursor);
                                return callback();

                            case 'advance':
                            case 'next':
                            case 'count':
                                return _cursor[type].apply(_cursor, _toConsumableArray(cursorArgs)).then(function (result) {
                                    return callback(null, result);
                                }).catch(function (err) {
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
                                callback('Unknown command: "' + type + '"');
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
                    return restService[type].apply(restService, [restName].concat(_toConsumableArray(args))).then(function (result) {
                        return callback(null, result);
                    }).catch(function (err) {
                        return callback(err.message || err);
                    });

                default:
                    callback('Unknown command: "' + type + '"');
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
        return typeof input === 'undefined' ? 'undefined' : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret2 = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(function (item) {
                    return _inspect(item, depth) === first;
                })) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(function (item) {
                            return _inspect(item, depth);
                        }).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
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
        var entries = keys.slice(0, maxKeys).map(function (key) {
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