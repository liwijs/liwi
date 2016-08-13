var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Cursor from 'mongodb/lib/cursor';
import MongoStore from './MongoStore';
import AbstractCursor from '../store/AbstractCursor';

var MongoCursor = function (_AbstractCursor) {
    _inherits(MongoCursor, _AbstractCursor);

    function MongoCursor(store, cursor) {
        _classCallCheck(this, MongoCursor);

        if (!(store instanceof MongoStore)) {
            throw new TypeError('Value of argument "store" violates contract.\n\nExpected:\nMongoStore\n\nGot:\n' + _inspect(store));
        }

        if (!(cursor instanceof Cursor)) {
            throw new TypeError('Value of argument "cursor" violates contract.\n\nExpected:\nCursor\n\nGot:\n' + _inspect(cursor));
        }

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MongoCursor).call(this, store));

        _this._cursor = cursor;
        return _this;
    }

    _createClass(MongoCursor, [{
        key: 'advance',
        value: function advance(count) {
            if (!(typeof count === 'number')) {
                throw new TypeError('Value of argument "count" violates contract.\n\nExpected:\nnumber\n\nGot:\n' + _inspect(count));
            }

            this._cursor.skip(count);
        }
    }, {
        key: 'next',
        value: function next() {
            var _this2 = this;

            function _ref2(_id2) {
                if (!(_id2 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<any>\n\nGot:\n' + _inspect(_id2));
                }

                return _id2;
            }

            return _ref2(this._cursor.next().then(function (value) {
                _this2._result = value;
                _this2.key = value && value._id;
                return _this2.key;
            }));
        }
    }, {
        key: 'limit',
        value: function limit(newLimit) {
            function _ref3(_id3) {
                if (!(_id3 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id3));
                }

                return _id3;
            }

            if (!(typeof newLimit === 'number')) {
                throw new TypeError('Value of argument "newLimit" violates contract.\n\nExpected:\nnumber\n\nGot:\n' + _inspect(newLimit));
            }

            this._cursor.limit(newLimit);
            return _ref3(Promise.resolve(this));
        }
    }, {
        key: 'count',
        value: function count() {
            var applyLimit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            if (!(typeof applyLimit === 'boolean')) {
                throw new TypeError('Value of argument "applyLimit" violates contract.\n\nExpected:\nbool\n\nGot:\n' + _inspect(applyLimit));
            }

            return this._cursor.count(applyLimit);
        }
    }, {
        key: 'result',
        value: function result() {
            return Promise.resolve(this._result);
        }
    }, {
        key: 'close',
        value: function close() {
            if (this._cursor) {
                this._cursor.close();
                this._cursor = this._store = this._result = undefined;
            }

            return Promise.resolve();
        }
    }, {
        key: 'toArray',
        value: function toArray() {
            function _ref4(_id4) {
                if (!(_id4 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<Array>\n\nGot:\n' + _inspect(_id4));
                }

                return _id4;
            }

            return _ref4(this._cursor.toArray());
        }
    }]);

    return MongoCursor;
}(AbstractCursor);

export default MongoCursor;

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
//# sourceMappingURL=MongoCursor.js.map