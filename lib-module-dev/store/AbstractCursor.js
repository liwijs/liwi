var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

var _class, _temp;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { return void reject(error); } return info.done ? void resolve(value) : Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

/* eslint-disable no-await-in-loop */
import { ResultType as _ResultType } from '../types';

import t from 'flow-runtime';
var ResultType = t.tdz(function () {
  return _ResultType;
});

var _AbstractCursorTypeParametersSymbol = Symbol('AbstractCursorTypeParameters');

var AbstractCursor = (_temp = _class = function () {
  function AbstractCursor(store) {
    _classCallCheck(this, AbstractCursor), this[_AbstractCursorTypeParametersSymbol] = {
      Store: t.typeParameter('Store')
    };

    var _storeType = t.flowInto(this[_AbstractCursorTypeParametersSymbol].Store);

    t.param('store', _storeType).assert(store), this._store = store;
  }

  return _createClass(AbstractCursor, [{
    key: 'close',
    value: function close() {
      throw new Error('close() missing implementation');
    }
  }, {
    key: 'next',
    value: function next() {
      t.return(t.any());

      throw new Error('next() missing implementation');
    }
  }, {
    key: 'nextResult',
    value: function nextResult() {
      var _this = this;

      var _returnType4 = t.return(t.any());

      return this.next().then(function () {
        return _this.result();
      }).then(function (_arg) {
        return _returnType4.assert(_arg);
      });
    }
  }, {
    key: 'limit',
    value: function limit(newLimit) {
      var _newLimitType = t.number();

      t.return(t.void());

      throw t.param('newLimit', _newLimitType).assert(newLimit), new Error('limit() missing implementation');
    }
  }, {
    key: 'count',
    value: function count() {
      var applyLimit = arguments.length > 0 && arguments[0] !== void 0 && arguments[0];

      var _applyLimitType = t.boolean();

      throw t.param('applyLimit', _applyLimitType).assert(applyLimit), new Error('count() missing implementation');
    }
  }, {
    key: 'result',
    value: function result() {
      var _returnType6 = t.return(t.ref(ResultType));

      return this.store.findByKey(this.key).then(function (_arg2) {
        return _returnType6.assert(_arg2);
      });
    }
  }, {
    key: 'delete',
    value: function _delete() {
      var _returnType7 = t.return(t.void());

      return this.store.deleteByKey(this.key).then(function (_arg3) {
        return _returnType7.assert(_arg3);
      });
    }
  }, {
    key: 'forEachKeys',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(callback) {
        var _callbackType, _returnType, key;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          for (;;) switch (_context.prev = _context.next) {
            case 0:
              _callbackType = t.function(), _returnType = t.return(t.union(t.void(), t.ref('Promise', t.void()))), t.param('callback', _callbackType).assert(callback);

            case 3:
              return _context.next = 6, this.next();

            case 6:
              if (key = _context.sent, key) {
                _context.next = 9;
                break;
              }

              return _context.abrupt('return', _returnType.assert());

            case 9:
              return _context.next = 11, callback(key);

            case 11:
              _context.next = 3;
              break;

            case 13:
            case 'end':
              return _context.stop();
          }
        }, _callee, this);
      }));

      return function forEachKeys() {
        return _ref.apply(this, arguments);
      };
    }()
  }, {
    key: 'forEach',
    value: function forEach(callback) {
      var _this2 = this;

      var _returnType8 = t.return(t.void());

      return this.forEachKeys(function () {
        return _this2.result().then(function (result) {
          return callback(result);
        });
      }).then(function (_arg4) {
        return _returnType8.assert(_arg4);
      });
    }
  }, {
    key: 'keysIterator',
    value: regeneratorRuntime.mark(function keysIterator() {
      return regeneratorRuntime.wrap(function keysIterator$(_context2) {
        for (;;) switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.next = 3, this.next();

          case 3:
            _context2.next = 0;
            break;

          case 5:
          case 'end':
            return _context2.stop();
        }
      }, keysIterator, this);
    })
  }, {
    key: Symbol.iterator,
    value: regeneratorRuntime.mark(function value() {
      var _this3 = this;

      var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _step, _iterator, keyPromise;

      return regeneratorRuntime.wrap(function value$(_context3) {
        for (;;) switch (_context3.prev = _context3.next) {
          case 0:
            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = void 0, _context3.prev = 3, _iterator = this.keysIterator()[Symbol.iterator]();

          case 5:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context3.next = 12;
              break;
            }

            return keyPromise = _step.value, _context3.next = 9, keyPromise.then(function (key) {
              return key && _this3.result();
            });

          case 9:
            _iteratorNormalCompletion = true, _context3.next = 5;
            break;

          case 12:
            _context3.next = 17;
            break;

          case 14:
            _context3.prev = 14, _context3.t0 = _context3['catch'](3), _didIteratorError = true, _iteratorError = _context3.t0;

          case 17:
            _context3.prev = 17, _context3.prev = 18, !_iteratorNormalCompletion && _iterator.return && _iterator.return();

          case 20:
            if (_context3.prev = 20, !_didIteratorError) {
              _context3.next = 23;
              break;
            }

            throw _iteratorError;

          case 23:
            return _context3.finish(20);

          case 24:
            return _context3.finish(17);

          case 25:
          case 'end':
            return _context3.stop();
        }
      }, value, this, [[3, 14, 17, 25], [18,, 20, 24]]);
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
      var _returnType2 = t.return(this[_AbstractCursorTypeParametersSymbol].Store);

      return _returnType2.assert(this._store);
    }
  }]), AbstractCursor;
}(), _class[t.TypeParametersSymbol] = _AbstractCursorTypeParametersSymbol, _temp);
export { AbstractCursor as default };
//# sourceMappingURL=AbstractCursor.js.map