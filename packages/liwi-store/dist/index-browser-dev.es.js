import assert from 'assert';

var AbstractConnection = function AbstractConnection() {};

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var _Symbol$iterator = Symbol.iterator;

/* eslint-disable no-await-in-loop */
var AbstractCursor =
/*#__PURE__*/
function () {
  function AbstractCursor(store) {
    this.key = void 0;
    this._store = void 0;
    this._store = store;
  }

  var _proto = AbstractCursor.prototype;

  _proto.nextResult = function nextResult() {
    var _this = this;

    return this.next().then(function () {
      return _this.result();
    });
  };

  _proto.result = function result() {
    if (!this.key) throw new Error('Cannot call result() before next()');
    return this.store.findByKey(this.key);
  };

  _proto.delete = function _delete() {
    return this.store.deleteByKey(this.key);
  };

  _proto.forEachKeys =
  /*#__PURE__*/
  function () {
    var _forEachKeys = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(callback) {
      var key;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 3;
              return this.next();

            case 3:
              key = _context.sent;

              if (key) {
                _context.next = 6;
                break;
              }

              return _context.abrupt("return");

            case 6:
              _context.next = 8;
              return callback(key);

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

  _proto.keysIterator =
  /*#__PURE__*/
  regeneratorRuntime.mark(function keysIterator() {
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
          case "end":
            return _context2.stop();
        }
      }
    }, keysIterator, this);
  });
  _proto[_Symbol$iterator] =
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var _this3 = this;

    var _iterator, _isArray, _i, _ref, keyPromise;

    return regeneratorRuntime.wrap(function _callee2$(_context3) {
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
    }, _callee2, this);
  }); // TODO Symbol.asyncIterator, https://phabricator.babeljs.io/T7356

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

  _createClass(AbstractCursor, [{
    key: "store",
    get: function get() {
      return this._store;
    }
  }]);

  return AbstractCursor;
}();

var AbstractQuery =
/*#__PURE__*/
function () {
  function AbstractQuery(store) {
    this.store = void 0;
    this.store = store;
  }

  var _proto = AbstractQuery.prototype;

  _proto.fetchAndSubscribe = function fetchAndSubscribe(callback) {
    var _len, args, _key;

    for (_len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return this._subscribe(callback, true, args);
  };

  _proto.subscribe = function subscribe(callback) {
    var _len2, args, _key2;

    for (_len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return this._subscribe(callback, false, args);
  };

  return AbstractQuery;
}();

var AbstractStore =
/*#__PURE__*/
function () {
  function AbstractStore(connection, keyPath) {
    this._connection = void 0;
    this.keyPath = void 0;
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

  _createClass(AbstractStore, [{
    key: "connection",
    get: function get() {
      return this._connection;
    }
  }]);

  return AbstractStore;
}();

export { AbstractConnection, AbstractCursor, AbstractQuery, AbstractStore };
//# sourceMappingURL=index-browser-dev.es.js.map
