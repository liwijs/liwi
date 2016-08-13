import WebsocketStore from './WebsocketStore';
import AbstractCursor from '../store/AbstractCursor';

export default class WebsocketCursor extends AbstractCursor {

    constructor(store, options) {
        if (!(store instanceof WebsocketStore)) {
            throw new TypeError('Value of argument "store" violates contract.\n\nExpected:\nWebsocketStore\n\nGot:\n' + _inspect(store));
        }

        super(store);
        this._options = options;

        if (!(this._options == null || this._options instanceof Object)) {
            throw new TypeError('Value of "this._options" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(this._options));
        }
    }

    /* options */

    limit(newLimit) {
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

    _create() {
        if (this._idCursor) throw new Error('Cursor already created');
        return this.store.connection.emit('createCursor', this._options).then(idCursor => {
            if (!idCursor) return;
            this._idCursor = idCursor;

            if (!(this._idCursor == null || typeof this._idCursor === 'number')) {
                throw new TypeError('Value of "this._idCursor" violates contract.\n\nExpected:\n?number\n\nGot:\n' + _inspect(this._idCursor));
            }
        });
    }

    emit(type) {
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
            return _ref2(this._create().then(() => {
                return this.emit(type, ...args);
            }));
        }

        return _ref2(this.store.emit('cursor', { type, id: this._idCursor }, args));
    }

    advance(count) {
        if (!(typeof count === 'number')) {
            throw new TypeError('Value of argument "count" violates contract.\n\nExpected:\nnumber\n\nGot:\n' + _inspect(count));
        }

        this.emit('advance', count);
        return this;
    }

    next() {
        function _ref3(_id3) {
            if (!(_id3 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<?anyany>\n\nGot:\n' + _inspect(_id3));
            }

            return _id3;
        }

        return _ref3(this.emit('next').then(result => {
            this._result = result;

            if (!(this._result == null || this._result instanceof Object)) {
                throw new TypeError('Value of "this._result" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(this._result));
            }

            this.key = result && result[this._store.keyPath];
            return this.key;
        }));
    }

    result() {
        function _ref4(_id4) {
            if (!(_id4 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<?ModelTypeModelType>\n\nGot:\n' + _inspect(_id4));
            }

            return _id4;
        }

        return _ref4(Promise.resolve(this._result));
    }

    count() {
        var applyLimit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        if (!(typeof applyLimit === 'boolean')) {
            throw new TypeError('Value of argument "applyLimit" violates contract.\n\nExpected:\nbool\n\nGot:\n' + _inspect(applyLimit));
        }

        return this.emit('count', applyLimit);
    }

    close() {
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

    toArray() {
        function _ref6(_id6) {
            if (!(_id6 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<Array>\n\nGot:\n' + _inspect(_id6));
            }

            return _id6;
        }

        return _ref6(this.store.emit('cursor toArray', this._options, result => {
            this.close();
            return result;
        }));
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
//# sourceMappingURL=WebsocketCursor.js.map