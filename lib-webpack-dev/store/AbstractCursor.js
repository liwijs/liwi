var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractCursor = function () {
  function AbstractCursor(store) {
    _classCallCheck(this, AbstractCursor);

    this._store = store;
  }

  _createClass(AbstractCursor, [{
    key: 'close',
    value: function close() {
      throw new Error('close() missing implementation');
    }
  }, {
    key: 'next',
    value: function next() {
      throw new Error('next() missing implementation');
    }
  }, {
    key: 'nextResult',
    value: function nextResult() {
      var _this = this;

      function _ref3(_id3) {
        if (!(_id3 instanceof Promise)) {
          throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<any>\n\nGot:\n' + _inspect(_id3));
        }

        return _id3;
      }

      return _ref3(this.next().then(function () {
        return _this.result();
      }));
    }
  }, {
    key: 'limit',
    value: function limit(newLimit) {
      if (!(typeof newLimit === 'number')) {
        throw new TypeError('Value of argument "newLimit" violates contract.\n\nExpected:\nnumber\n\nGot:\n' + _inspect(newLimit));
      }

      throw new Error('limit() missing implementation');
    }
  }, {
    key: 'count',
    value: function count() {
      var applyLimit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      if (!(typeof applyLimit === 'boolean')) {
        throw new TypeError('Value of argument "applyLimit" violates contract.\n\nExpected:\nbool\n\nGot:\n' + _inspect(applyLimit));
      }

      throw new Error('count() missing implementation');
    }
  }, {
    key: 'result',
    value: function result() {
      function _ref5(_id5) {
        if (!(_id5 instanceof Promise)) {
          throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<ObjectType>\n\nGot:\n' + _inspect(_id5));
        }

        return _id5;
      }

      return _ref5(this.store.findByKey(this.key));
    }
  }, {
    key: 'delete',
    value: function _delete() {
      function _ref6(_id6) {
        if (!(_id6 instanceof Promise)) {
          throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id6));
        }

        return _id6;
      }

      return _ref6(this.store.deleteByKey(this.key));
    }
  }, {
    key: 'forEachKeys',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(callback) {
        var key;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (typeof callback === 'function') {
                  _context.next = 2;
                  break;
                }

                throw new TypeError('Value of argument "callback" violates contract.\n\nExpected:\nFunction\n\nGot:\n' + _inspect(callback));

              case 2:
                _context.next = 5;
                return this.next();

              case 5:
                key = _context.sent;

                if (key) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt('return');

              case 8:
                _context.next = 10;
                return callback(key);

              case 10:
                _context.next = 2;
                break;

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function forEachKeys(_x2) {
        return _ref.apply(this, arguments);
      }

      return forEachKeys;
    }()
  }, {
    key: 'forEach',
    value: function forEach(callback) {
      var _this2 = this;

      function _ref8(_id8) {
        if (!(_id8 instanceof Promise)) {
          throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id8));
        }

        return _id8;
      }

      return _ref8(this.forEachKeys(function () {
        return _this2.result().then(function (result) {
          return callback(result);
        });
      }));
    }
  }, {
    key: 'keysIterator',
    value: regeneratorRuntime.mark(function keysIterator() {
      return regeneratorRuntime.wrap(function keysIterator$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 3;
              return this.next();

            case 3:
              _context2.next = 0;
              break;

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, keysIterator, this);
    })
  }, {
    key: Symbol.iterator,
    value: regeneratorRuntime.mark(function value() {
      var _this3 = this;

      var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _keysIterator, keyPromise;

      return regeneratorRuntime.wrap(function value$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _keysIterator = this.keysIterator();

              if (_keysIterator && (typeof _keysIterator[Symbol.iterator] === 'function' || Array.isArray(_keysIterator))) {
                _context3.next = 3;
                break;
              }

              throw new TypeError('Expected _keysIterator to be iterable, got ' + _inspect(_keysIterator));

            case 3:
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context3.prev = 6;
              _iterator = _keysIterator[Symbol.iterator]();

            case 8:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context3.next = 15;
                break;
              }

              keyPromise = _step.value;
              _context3.next = 12;
              return keyPromise.then(function (key) {
                return key && _this3.result();
              });

            case 12:
              _iteratorNormalCompletion = true;
              _context3.next = 8;
              break;

            case 15:
              _context3.next = 21;
              break;

            case 17:
              _context3.prev = 17;
              _context3.t0 = _context3['catch'](6);
              _didIteratorError = true;
              _iteratorError = _context3.t0;

            case 21:
              _context3.prev = 21;
              _context3.prev = 22;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 24:
              _context3.prev = 24;

              if (!_didIteratorError) {
                _context3.next = 27;
                break;
              }

              throw _iteratorError;

            case 27:
              return _context3.finish(24);

            case 28:
              return _context3.finish(21);

            case 29:
            case 'end':
              return _context3.stop();
          }
        }
      }, value, this, [[6, 17, 21, 29], [22,, 24, 28]]);
    })

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

  }, {
    key: 'store',
    get: function get() {
      return this._store;
    }
  }]);

  return AbstractCursor;
}();

export default AbstractCursor;

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
//# sourceMappingURL=AbstractCursor.js.map