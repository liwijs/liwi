var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import RestCursor from './RestCursor';

var RestService = function () {
    function RestService(restResources) {
        _classCallCheck(this, RestService);

        if (!(restResources instanceof Map)) {
            throw new TypeError('Value of argument "restResources" violates contract.\n\nExpected:\nMap\n\nGot:\n' + _inspect(restResources));
        }

        this.restResources = restResources;
    }

    _createClass(RestService, [{
        key: 'addRestResource',
        value: function addRestResource(key, restResource) {
            if (!(typeof key === 'string')) {
                throw new TypeError('Value of argument "key" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(key));
            }

            this.restResources.set(key, restResource);
        }
    }, {
        key: 'get',
        value: function get(key) {
            if (!(typeof key === 'string')) {
                throw new TypeError('Value of argument "key" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(key));
            }

            var restResource = this.restResources.get(key);
            if (!restResource) throw new Error('Invalid rest resource: "' + key + '"');
            return restResource;
        }
    }, {
        key: 'createCursor',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(restName, _ref2) {
                var criteria = _ref2.criteria;
                var sort = _ref2.sort;
                var limit = _ref2.limit;
                var restResource,
                    cursor,
                    _args = arguments;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (typeof restName === 'string') {
                                    _context.next = 2;
                                    break;
                                }

                                throw new TypeError('Value of argument "restName" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(restName));

                            case 2:
                                if (_args[1] != null && (_args[1].criteria == null || _args[1].criteria instanceof Object) && (_args[1].sort == null || _args[1].sort instanceof Object) && (_args[1].limit == null || typeof _args[1].limit === 'number')) {
                                    _context.next = 4;
                                    break;
                                }

                                throw new TypeError('Value of argument 1 violates contract.\n\nExpected:\n{ criteria: ?Object;\n  sort: ?Object;\n  limit: ?number;\n}\n\nGot:\n' + _inspect(_args[1]));

                            case 4:
                                restResource = this.get(restName);

                                criteria = restResource.criteria(null, criteria || {});
                                sort = restResource.sort(null, sort);
                                _context.next = 9;
                                return restResource.store.cursor(criteria, sort);

                            case 9:
                                cursor = _context.sent;

                                if (limit) cursor.limit(limit);
                                return _context.abrupt('return', new RestCursor(cursor));

                            case 12:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function createCursor(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return createCursor;
        }()
    }]);

    return RestService;
}();

export default RestService;

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
            var _ret = function () {
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

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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
//# sourceMappingURL=RestService.js.map