function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

export default class AbstractCursor {

    constructor(store) {
        this._store = store;
    }

    get store() {
        return this._store;
    }

    close() {
        throw new Error('close() missing implementation');
    }

    next() {
        throw new Error('next() missing implementation');
    }

    nextResult() {
        function _ref3(_id3) {
            if (!(_id3 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<any>\n\nGot:\n' + _inspect(_id3));
            }

            return _id3;
        }

        return _ref3(this.next().then(() => {
            return this.result();
        }));
    }

    limit(newLimit) {
        if (!(typeof newLimit === 'number')) {
            throw new TypeError('Value of argument "newLimit" violates contract.\n\nExpected:\nnumber\n\nGot:\n' + _inspect(newLimit));
        }

        throw new Error('limit() missing implementation');
    }

    count() {
        var applyLimit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        if (!(typeof applyLimit === 'boolean')) {
            throw new TypeError('Value of argument "applyLimit" violates contract.\n\nExpected:\nbool\n\nGot:\n' + _inspect(applyLimit));
        }

        throw new Error('count() missing implementation');
    }

    result() {
        function _ref5(_id5) {
            if (!(_id5 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<ObjectType>\n\nGot:\n' + _inspect(_id5));
            }

            return _id5;
        }

        return _ref5(this.store.findByKey(this.key));
    }

    delete() {
        function _ref6(_id6) {
            if (!(_id6 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id6));
            }

            return _id6;
        }

        return _ref6(this.store.deleteByKey(this.key));
    }

    forEachKeys(callback) {
        var _this = this;

        return _asyncToGenerator(function* () {
            if (!(typeof callback === 'function')) {
                throw new TypeError('Value of argument "callback" violates contract.\n\nExpected:\nFunction\n\nGot:\n' + _inspect(callback));
            }

            while (true) {
                var key = yield _this.next();
                if (!key) return;

                yield callback(key);
            }
        })();
    }

    forEach(callback) {
        function _ref8(_id8) {
            if (!(_id8 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id8));
            }

            return _id8;
        }

        return _ref8(this.forEachKeys(() => {
            return this.result().then(result => {
                return callback(result);
            });
        }));
    }

    *keysIterator() {
        while (true) {
            yield this.next();
        }
    }

    *[Symbol.iterator]() {
        _keysIterator = this.keysIterator();

        if (!(_keysIterator && (typeof _keysIterator[Symbol.iterator] === 'function' || Array.isArray(_keysIterator)))) {
            throw new TypeError('Expected _keysIterator to be iterable, got ' + _inspect(_keysIterator));
        }

        for (var keyPromise of _keysIterator) {
            var _keysIterator;

            yield keyPromise.then(key => {
                return key && this.result();
            });
        }
    }

    // TODO Symbol.asyncIterator, https://phabricator.babeljs.io/T7356
    /*
    async *keysAsyncIterator() {
        while (true) {
             const key = await this.next();
             if (!key) return;
              yield key;
        }
     }
      async *[Symbol.asyncIterator] {
        for await (let key of this.keysAsyncIterator()) {
            yield await this.result();
        }
     }
     */
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
//# sourceMappingURL=AbstractCursor.js.map