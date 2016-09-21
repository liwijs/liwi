var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _t from 'tcomb-forked';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractCursor = function () {
  function AbstractCursor(store) {
    _assert(store, _t.Any, 'store');

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

      return this.next().then(function () {
        return _this.result();
      });
    }
  }, {
    key: 'limit',
    value: function limit(newLimit) {
      _assert(newLimit, _t.Number, 'newLimit');

      throw new Error('limit() missing implementation');
    }
  }, {
    key: 'count',
    value: function count() {
      var applyLimit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      _assert(applyLimit, _t.Boolean, 'applyLimit');

      throw new Error('count() missing implementation');
    }
  }, {
    key: 'result',
    value: function result() {
      return this.store.findByKey(this.key);
    }
  }, {
    key: 'delete',
    value: function _delete() {
      return this.store.deleteByKey(this.key);
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
                _assert(callback, _t.Function, 'callback');

              case 1:
                _context.next = 4;
                return this.next();

              case 4:
                key = _context.sent;

                if (key) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt('return');

              case 7:
                _context.next = 9;
                return callback(key);

              case 9:
                _context.next = 1;
                break;

              case 11:
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

      return this.forEachKeys(function () {
        return _this2.result().then(function (result) {
          return callback(result);
        });
      });
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

      var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, keyPromise;

      return regeneratorRuntime.wrap(function value$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context3.prev = 3;
              _iterator = this.keysIterator()[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context3.next = 12;
                break;
              }

              keyPromise = _step.value;
              _context3.next = 9;
              return keyPromise.then(function (key) {
                return key && _this3.result();
              });

            case 9:
              _iteratorNormalCompletion = true;
              _context3.next = 5;
              break;

            case 12:
              _context3.next = 18;
              break;

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3['catch'](3);
              _didIteratorError = true;
              _iteratorError = _context3.t0;

            case 18:
              _context3.prev = 18;
              _context3.prev = 19;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 21:
              _context3.prev = 21;

              if (!_didIteratorError) {
                _context3.next = 24;
                break;
              }

              throw _iteratorError;

            case 24:
              return _context3.finish(21);

            case 25:
              return _context3.finish(18);

            case 26:
            case 'end':
              return _context3.stop();
          }
        }
      }, value, this, [[3, 14, 18, 26], [19,, 21, 25]]);
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

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }

    return type(x);
  }

  if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=AbstractCursor.js.map