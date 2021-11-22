'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _asyncToGenerator = require('@babel/runtime/helpers/esm/asyncToGenerator');
var _regeneratorRuntime = require('@babel/runtime/regenerator');
var _createClass = require('@babel/runtime/helpers/esm/createClass');
var _inheritsLoose = require('@babel/runtime/helpers/esm/inheritsLoose');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

var _asyncToGenerator__default = /*#__PURE__*/_interopDefaultLegacy(_asyncToGenerator);
var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);
var _createClass__default = /*#__PURE__*/_interopDefaultLegacy(_createClass);
var _inheritsLoose__default = /*#__PURE__*/_interopDefaultLegacy(_inheritsLoose);

var AbstractConnection = function AbstractConnection() {};

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it, i; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { var i, arr2; if (len == null || len > arr.length) len = arr.length; for (i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var AbstractCursor = /*#__PURE__*/function () {
  function AbstractCursor() {}

  var _proto = AbstractCursor.prototype;

  _proto.nextResult = function nextResult() {
    var _this = this;

    return this.next().then(function () {
      return _this.result();
    });
  };

  _proto.forEachKeys = /*#__PURE__*/function () {
    var _forEachKeys = _asyncToGenerator__default( /*#__PURE__*/_regeneratorRuntime__default.mark(function _callee(callback) {
      var _key;

      return _regeneratorRuntime__default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 3;
              return this.next();

            case 3:
              _key = _context.sent;

              if (_key) {
                _context.next = 6;
                break;
              }

              return _context.abrupt("return");

            case 6:
              _context.next = 8;
              return callback(_key);

            case 8:
              _context.next = 0;
              break;

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function forEachKeys() {
      return _forEachKeys.apply(this, arguments);
    };
  }();

  _proto.forEach = function forEach(callback) {
    var _this2 = this;

    return this.forEachKeys(function () {
      return _this2.result().then(function (result) {
        return callback(result);
      });
    });
  };

  _proto.keysIterator = /*#__PURE__*/_regeneratorRuntime__default.mark(function keysIterator() {
    return _regeneratorRuntime__default.wrap(function keysIterator$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 3;
            return this.next();

          case 3:
            _context2.next = 0;
            break;

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, keysIterator, this);
  });
  _proto[Symbol.iterator] = /*#__PURE__*/_regeneratorRuntime__default.mark(function _callee2() {
    var _this3 = this;

    var _iterator, _step, keyPromise;

    return _regeneratorRuntime__default.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _iterator = _createForOfIteratorHelperLoose(this.keysIterator());

          case 1:
            if ((_step = _iterator()).done) {
              _context3.next = 7;
              break;
            }

            keyPromise = _step.value;
            _context3.next = 5;
            return keyPromise.then(function (key) {
              return key && _this3.result();
            });

          case 5:
            _context3.next = 1;
            break;

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee2, this);
  }) // TODO Symbol.asyncIterator, https://phabricator.babeljs.io/T7356

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
  ;
  return AbstractCursor;
}();

var AbstractStoreCursor = /*#__PURE__*/function (_AbstractCursor) {
  _inheritsLoose__default(AbstractStoreCursor, _AbstractCursor);

  function AbstractStoreCursor(store) {
    var _this = _AbstractCursor.call(this) || this;

    _this._store = store;
    return _this;
  }

  var _proto = AbstractStoreCursor.prototype;

  _proto.overrideStore = function overrideStore(store) {
    this._store = store;
  };

  _proto.result = function result() {
    if (!this.key) throw new Error('Cannot call result() before next()');
    return this.store.findByKey(this.key);
  };

  _proto.delete = function _delete() {
    return this.store.deleteByKey(this.key);
  };

  _createClass__default(AbstractStoreCursor, [{
    key: "store",
    get: function get() {
      return this._store;
    }
  }]);

  return AbstractStoreCursor;
}(AbstractCursor);

exports.AbstractConnection = AbstractConnection;
exports.AbstractCursor = AbstractCursor;
exports.AbstractStoreCursor = AbstractStoreCursor;
//# sourceMappingURL=index-browser-dev.cjs.js.map
