import _createForOfIteratorHelperLoose from '@babel/runtime/helpers/esm/createForOfIteratorHelperLoose';
import _regeneratorRuntime from '@babel/runtime/helpers/esm/regeneratorRuntime';
import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import _createClass from '@babel/runtime/helpers/esm/createClass';
import _inheritsLoose from '@babel/runtime/helpers/esm/inheritsLoose';

var AbstractConnection = function AbstractConnection() {};

var AbstractCursor = /*#__PURE__*/function (_Symbol$iterator) {
  function AbstractCursor() {}
  var _proto = AbstractCursor.prototype;
  _proto.nextResult = function nextResult() {
    return this.next().then(function () {
      return this.result();
    });
  };
  _proto.forEachKeys = /*#__PURE__*/function () {
    var _forEachKeys = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(callback) {
      var _key;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
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
    return this.forEachKeys(function () {
      return this.result().then(function (result) {
        return callback(result);
      });
    });
  };
  _proto.keysIterator = /*#__PURE__*/_regeneratorRuntime().mark(function keysIterator() {
    return _regeneratorRuntime().wrap(function keysIterator$(_context2) {
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
  _proto[_Symbol$iterator] = /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var _iterator, _step, keyPromise;
    return _regeneratorRuntime().wrap(function _callee2$(_context3) {
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
              return key && this.result();
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
}(Symbol.iterator);

var AbstractStoreCursor = /*#__PURE__*/function (_AbstractCursor) {
  _inheritsLoose(AbstractStoreCursor, _AbstractCursor);
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
  _proto["delete"] = function _delete() {
    return this.store.deleteByKey(this.key);
  };
  _createClass(AbstractStoreCursor, [{
    key: "store",
    get: function get() {
      return this._store;
    }
  }]);
  return AbstractStoreCursor;
}(AbstractCursor);

export { AbstractConnection, AbstractCursor, AbstractStoreCursor };
//# sourceMappingURL=index-browser.es.js.map
