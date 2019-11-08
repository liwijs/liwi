import _regeneratorRuntime from '@babel/runtime/regenerator';
import _createClass from '@babel/runtime/helpers/esm/createClass';
import _inheritsLoose from '@babel/runtime/helpers/esm/inheritsLoose';
import assert from 'assert';

var AbstractConnection = function AbstractConnection() {};

/* eslint-disable no-await-in-loop */
var AbstractCursor =
/*#__PURE__*/
function () {
  function AbstractCursor() {}

  var _proto = AbstractCursor.prototype;

  _proto.nextResult = function nextResult() {
    var _this = this;

    return this.next().then(function () {
      return _this.result();
    });
  };

  _proto.forEachKeys = function forEachKeys(callback) {
    var _key;

    return _regeneratorRuntime.async(function forEachKeys$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 3;
            return _regeneratorRuntime.awrap(this.next());

          case 3:
            _key = _context.sent;

            if (_key) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return");

          case 6:
            _context.next = 8;
            return _regeneratorRuntime.awrap(callback(_key));

          case 8:
            _context.next = 0;
            break;

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, null, this);
  };

  _proto.forEach = function forEach(callback) {
    var _this2 = this;

    return this.forEachKeys(function () {
      return _this2.result().then(function (result) {
        return callback(result);
      });
    });
  };

  _proto.keysIterator =
  /*#__PURE__*/
  _regeneratorRuntime.mark(function keysIterator() {
    return _regeneratorRuntime.wrap(function keysIterator$(_context2) {
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
  _proto[Symbol.iterator] =
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee() {
    var _this3 = this;

    var _iterator, _isArray, _i, _ref, keyPromise;

    return _regeneratorRuntime.wrap(function _callee$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _iterator = this.keysIterator(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

          case 1:
            if (!_isArray) {
              _context3.next = 7;
              break;
            }

            if (!(_i >= _iterator.length)) {
              _context3.next = 4;
              break;
            }

            return _context3.abrupt("break", 16);

          case 4:
            _ref = _iterator[_i++];
            _context3.next = 11;
            break;

          case 7:
            _i = _iterator.next();

            if (!_i.done) {
              _context3.next = 10;
              break;
            }

            return _context3.abrupt("break", 16);

          case 10:
            _ref = _i.value;

          case 11:
            keyPromise = _ref;
            _context3.next = 14;
            return keyPromise.then(function (key) {
              return key && _this3.result();
            });

          case 14:
            _context3.next = 1;
            break;

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee, this);
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

var AbstractStoreCursor =
/*#__PURE__*/
function (_AbstractCursor) {
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

  _proto.delete = function _delete() {
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

var AbstractQuery =
/*#__PURE__*/
function () {
  function AbstractQuery() {}

  var _proto = AbstractQuery.prototype;

  _proto.fetchAndSubscribe = function fetchAndSubscribe(callback) {
    return this._subscribe(callback, true);
  };

  _proto.subscribe = function subscribe(callback) {
    return this._subscribe(callback, false);
  };

  return AbstractQuery;
}();

var AbstractStore =
/*#__PURE__*/
function () {
  function AbstractStore(connection, keyPath) {
    assert(connection);
    this._connection = connection;
    this.keyPath = keyPath;
  }

  var _proto = AbstractStore.prototype;

  _proto.findAll = function findAll(criteria, sort) {
    return this.cursor(criteria, sort).then(function (cursor) {
      return cursor.toArray();
    });
  };

  _proto.upsertOne = function upsertOne(object) {
    var result;
    return _regeneratorRuntime.async(function upsertOne$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _regeneratorRuntime.awrap(this.upsertOneWithInfo(object));

          case 2:
            result = _context.sent;
            return _context.abrupt("return", result.object);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, null, this);
  };

  _proto.deleteOne = function deleteOne(object) {
    return this.deleteByKey(object[this.keyPath]);
  };

  _createClass(AbstractStore, [{
    key: "connection",
    get: function get() {
      return this._connection;
    }
  }]);

  return AbstractStore;
}();

export { AbstractConnection, AbstractCursor, AbstractQuery, AbstractStore, AbstractStoreCursor };
//# sourceMappingURL=index-browser-dev.es.js.map
