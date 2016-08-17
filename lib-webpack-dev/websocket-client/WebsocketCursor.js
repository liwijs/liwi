var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import WebsocketStore from './WebsocketStore';
import AbstractCursor from '../store/AbstractCursor';

var WebsocketCursor = function (_AbstractCursor) {
    _inherits(WebsocketCursor, _AbstractCursor);

    function WebsocketCursor(store, options) {
        _classCallCheck(this, WebsocketCursor);

        if (!(store instanceof WebsocketStore)) {
            throw new TypeError('Value of argument "store" violates contract.\n\nExpected:\nWebsocketStore\n\nGot:\n' + _inspect(store));
        }

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WebsocketCursor).call(this, store));

        _this._options = options;

        if (!(_this._options == null || _this._options instanceof Object)) {
            throw new TypeError('Value of "this._options" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(_this._options));
        }

        return _this;
    }

    /* options */

    _createClass(WebsocketCursor, [{
        key: 'limit',
        value: function limit(newLimit) {
            function _ref(_id) {
                if (!(_id instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<this>\n\nGot:\n' + _inspect(_id));
                }

                return _id;
            }

            if (!(typeof newLimit === 'number')) {
                throw new TypeError('Value of argument "newLimit" violates contract.\n\nExpected:\nnumber\n\nGot:\n' + _inspect(newLimit));
            }

            if (this._idCursor) throw new Error('Cursor already created');
            this._options.limit = newLimit;
            return _ref(Promise.resolve(this));
        }

        /* results */

    }, {
        key: '_create',
        value: function _create() {
            var _this2 = this;

            if (this._idCursor) throw new Error('Cursor already created');
            return this.store.connection.emit('createCursor', this._options).then(function (idCursor) {
                if (!idCursor) return;
                _this2._idCursor = idCursor;

                if (!(_this2._idCursor == null || typeof _this2._idCursor === 'number')) {
                    throw new TypeError('Value of "this._idCursor" violates contract.\n\nExpected:\n?number\n\nGot:\n' + _inspect(_this2._idCursor));
                }
            });
        }
    }, {
        key: 'emit',
        value: function emit(type) {
            var _this3 = this;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            function _ref2(_id2) {
                if (!(_id2 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id2));
                }

                return _id2;
            }

            if (!this._idCursor) {
                return _ref2(this._create().then(function () {
                    return _this3.emit.apply(_this3, [type].concat(args));
                }));
            }

            return _ref2(this.store.emit('cursor', { type: type, id: this._idCursor }, args));
        }
    }, {
        key: 'advance',
        value: function advance(count) {
            if (!(typeof count === 'number')) {
                throw new TypeError('Value of argument "count" violates contract.\n\nExpected:\nnumber\n\nGot:\n' + _inspect(count));
            }

            this.emit('advance', count);
            return this;
        }
    }, {
        key: 'next',
        value: function next() {
            var _this4 = this;

            function _ref3(_id3) {
                if (!(_id3 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<?any>\n\nGot:\n' + _inspect(_id3));
                }

                return _id3;
            }

            return _ref3(this.emit('next').then(function (result) {
                _this4._result = result;

                if (!(_this4._result == null || _this4._result instanceof Object)) {
                    throw new TypeError('Value of "this._result" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(_this4._result));
                }

                _this4.key = result && result[_this4._store.keyPath];
                return _this4.key;
            }));
        }
    }, {
        key: 'result',
        value: function result() {
            function _ref4(_id4) {
                if (!(_id4 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<?ModelType>\n\nGot:\n' + _inspect(_id4));
                }

                return _id4;
            }

            return _ref4(Promise.resolve(this._result));
        }
    }, {
        key: 'count',
        value: function count() {
            var applyLimit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            if (!(typeof applyLimit === 'boolean')) {
                throw new TypeError('Value of argument "applyLimit" violates contract.\n\nExpected:\nbool\n\nGot:\n' + _inspect(applyLimit));
            }

            return this.emit('count', applyLimit);
        }
    }, {
        key: 'close',
        value: function close() {
            function _ref5(_id5) {
                if (!(_id5 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id5));
                }

                return _id5;
            }

            if (!this._store) return _ref5(Promise.resolve());

            var closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
            this._idCursor = this._options = null;

            if (!(this._options == null || this._options instanceof Object)) {
                throw new TypeError('Value of "this._options" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(this._options));
            }

            if (!(this._idCursor == null || typeof this._idCursor === 'number')) {
                throw new TypeError('Value of "this._idCursor" violates contract.\n\nExpected:\n?number\n\nGot:\n' + _inspect(this._idCursor));
            }

            this._store = this._result = undefined;

            if (!(this._result == null || this._result instanceof Object)) {
                throw new TypeError('Value of "this._result" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(this._result));
            }

            return _ref5(closedPromise);
        }
    }, {
        key: 'toArray',
        value: function toArray() {
            var _this5 = this;

            function _ref6(_id6) {
                if (!(_id6 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<Array>\n\nGot:\n' + _inspect(_id6));
                }

                return _id6;
            }

            return _ref6(this.store.emit('cursor toArray', this._options, function (result) {
                _this5.close();
                return result;
            }));
        }
    }]);

    return WebsocketCursor;
}(AbstractCursor);

export default WebsocketCursor;

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
//# sourceMappingURL=WebsocketCursor.js.map