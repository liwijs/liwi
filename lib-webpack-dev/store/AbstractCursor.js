var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _t from 'tcomb-forked';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-await-in-loop */

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
      return _assert(function () {
        throw new Error('next() missing implementation');
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'nextResult',
    value: function nextResult() {
      return _assert(function () {
        var _this = this;

        return this.next().then(function () {
          return _this.result();
        });
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'limit',
    value: function limit() {
      return _assert(function () {
        throw new Error('limit() missing implementation');
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'count',
    value: function count() {
      var applyLimit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      _assert(applyLimit, _t.Boolean, 'applyLimit');

      throw new Error('count() missing implementation');
    }
  }, {
    key: 'result',
    value: function result() {
      return _assert(function () {
        return this.store.findByKey(this.key);
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'delete',
    value: function _delete() {
      return _assert(function () {
        return this.store.deleteByKey(this.key);
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'forEachKeys',
    value: function forEachKeys(callback) {
      _assert(callback, _t.Function, 'callback');

      return _assert(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var key;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (false) {
                  _context.next = 10;
                  break;
                }

                _context.next = 3;
                return this.next();

              case 3:
                key = _context.sent;

                if (key) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt('return');

              case 6:
                _context.next = 8;
                return callback(key);

              case 8:
                _context.next = 0;
                break;

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      })).apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'forEach',
    value: function forEach(callback) {
      return _assert(function () {
        var _this2 = this;

        return this.forEachKeys(function () {
          return _this2.result().then(function (result) {
            return callback(result);
          });
        });
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'keysIterator',
    value: regeneratorRuntime.mark(function keysIterator() {
      return regeneratorRuntime.wrap(function keysIterator$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (false) {
                _context2.next = 5;
                break;
              }

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
              // eslint-disable-next-line no-restricted-syntax
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
      return _assert(function () {
        return this._store;
      }.apply(this, arguments), _t.Any, 'return value');
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
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=AbstractCursor.js.map