'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var t = _interopDefault(require('flow-runtime'));
var assert = _interopDefault(require('assert'));

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
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
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var AbstractConnection = function AbstractConnection() {
  classCallCheck(this, AbstractConnection);
};

var InsertType = t.type("InsertType", t.object());
var UpdateType = t.type("UpdateType", t.object());
var ResultType = t.type("ResultType", t.object(t.property("created", t.union(t.ref("Date"), t.object()))));

var CursorInterfaceType = t.type("CursorInterfaceType", t.object(t.property("close", t.function(t.return(t.union(t.ref("Promise", t.void()), t.void())))), t.property("next", t.function(t.return(t.ref("Promise", t.any())))), t.property("nextResult", t.function(t.return(t.ref("Promise", t.any())))), t.property("limit", t.function(t.param("newLimit", t.number()), t.return(t.ref("Promise", t.void())))), t.property("count", t.function(t.param("applyLimit", t.nullable(t.boolean())), t.return(t.ref("Promise", t.number())))), t.property("result", t.function(t.return(t.ref("Promise", ResultType)))), t.property("delete", t.function(t.return(t.ref("Promise", t.void())))), t.property("forEachKeys", t.function(t.param("callback", t.function()), t.return(t.ref("Promise", t.void())))), t.property("forEach", t.function(t.param("callback", t.function()), t.return(t.ref("Promise", t.void()))))));

var StoreInterfaceType = t.type("StoreInterfaceType", t.object(t.property("create", t.function(t.return(t.ref("Promise", t.void())))), t.property("insertOne", t.function(t.param("object", InsertType), t.return(t.ref("Promise", ResultType)))), t.property("replaceOne", t.function(t.param("object", InsertType), t.return(t.ref("Promise", ResultType)))), t.property("upsertOne", t.function(t.param("object", InsertType), t.return(t.ref("Promise", ResultType)))), t.property("updateSeveral", t.function(t.param("objects", t.array(UpdateType)), t.return(t.ref("Promise", t.array(ResultType))))), t.property("partialUpdateByKey", t.function(t.param("key", t.any()), t.param("partialUpdate", UpdateType), t.return(t.ref("Promise", ResultType)))), t.property("partialUpdateOne", t.function(t.param("object", ResultType), t.param("partialUpdate", UpdateType), t.return(t.ref("Promise", ResultType)))), t.property("partialUpdateMany", t.function(t.param("criteria", t.object()), t.param("partialUpdate", UpdateType), t.return(t.ref("Promise", t.void())))), t.property("deleteByKey", t.function(t.param("key", t.any()), t.return(t.ref("Promise", t.void())))), t.property("cursor", t.function(t.param("criteria", t.nullable(t.object())), t.param("sort", t.nullable(t.object())), t.return(t.ref("Promise", t.ref(CursorInterfaceType, ResultType))))), t.property("findAll", t.function(t.param("criteria", t.nullable(t.object())), t.param("sort", t.nullable(t.object())), t.return(t.ref("Promise", t.array(ResultType))))), t.property("findByKey", t.function(t.param("key", t.any()), t.return(t.ref("Promise", t.nullable(ResultType))))), t.property("findOne", t.function(t.param("criteria", t.object()), t.param("sort", t.nullable(t.object())), t.return(t.ref("Promise", t.nullable(ResultType)))))));

var _class, _temp;
var ResultType$1 = t.tdz(function () {
  return ResultType;
});

var _AbstractCursorTypeParametersSymbol = Symbol('AbstractCursorTypeParameters');

var AbstractCursor = (_temp = _class = function () {
  function AbstractCursor(store) {
    classCallCheck(this, AbstractCursor);
    this[_AbstractCursorTypeParametersSymbol] = {
      Store: t.typeParameter('Store')
    };

    var _storeType = t.flowInto(this[_AbstractCursorTypeParametersSymbol].Store);

    t.param('store', _storeType).assert(store);

    this._store = store;
  }

  createClass(AbstractCursor, [{
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
      t.param('newLimit', _newLimitType).assert(newLimit);

      throw new Error('limit() missing implementation');
    }
  }, {
    key: 'count',
    value: function count() {
      var applyLimit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var _applyLimitType = t.boolean();

      t.param('applyLimit', _applyLimitType).assert(applyLimit);

      throw new Error('count() missing implementation');
    }
  }, {
    key: 'result',
    value: function result() {
      var _returnType6 = t.return(t.ref(ResultType$1));

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
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(callback) {
        var _callbackType, _returnType, key;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _callbackType = t.function();
                _returnType = t.return(t.union(t.void(), t.ref('Promise', t.void())));
                t.param('callback', _callbackType).assert(callback);

              case 3:
                _context.next = 6;
                return this.next();

              case 6:
                key = _context.sent;

                if (key) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt('return', _returnType.assert());

              case 9:
                _context.next = 11;
                return callback(key);

              case 11:
                _context.next = 3;
                break;

              case 13:
              case 'end':
                return _context.stop();
            }
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
    value: /*#__PURE__*/regeneratorRuntime.mark(function keysIterator() {
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
    value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
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
    get: function get$$1() {
      var _returnType2 = t.return(this[_AbstractCursorTypeParametersSymbol].Store);

      return _returnType2.assert(this._store);
    }
  }]);
  return AbstractCursor;
}(), _class[t.TypeParametersSymbol] = _AbstractCursorTypeParametersSymbol, _temp);

var _class$1, _temp$1;

var _AbstractStoreTypeParametersSymbol = Symbol('AbstractStoreTypeParameters');

var AbstractStore = (_temp$1 = _class$1 = function () {
  /**
   * @param {AbstractConnection} connection
   */
  function AbstractStore(connection) {
    classCallCheck(this, AbstractStore);
    this[_AbstractStoreTypeParametersSymbol] = {
      Connection: t.typeParameter('Connection')
    };

    var _connectionType = t.flowInto(this[_AbstractStoreTypeParametersSymbol].Connection);

    t.param('connection', _connectionType).assert(connection);

    assert(connection);
    this._connection = connection;
  }

  createClass(AbstractStore, [{
    key: 'findAll',
    value: function findAll(criteria, sort) {
      var _criteriaType = t.nullable(t.object());

      var _sortType = t.nullable(t.object());

      var _returnType2 = t.return(t.array(t.any()));

      t.param('criteria', _criteriaType).assert(criteria);
      t.param('sort', _sortType).assert(sort);

      return this.cursor(criteria, sort).then(function (cursor) {
        return cursor.toArray();
      }).then(function (_arg) {
        return _returnType2.assert(_arg);
      });
    }
  }, {
    key: 'connection',
    get: function get$$1() {
      var _returnType = t.return(this[_AbstractStoreTypeParametersSymbol].Connection);

      return _returnType.assert(this._connection);
    }
  }]);
  return AbstractStore;
}(), _class$1[t.TypeParametersSymbol] = _AbstractStoreTypeParametersSymbol, _temp$1);

var _class$2, _temp$2;

var _AbstractQueryTypeParametersSymbol = Symbol('AbstractQueryTypeParameters');

var AbstractQuery = (_temp$2 = _class$2 = function () {
  function AbstractQuery(store, queryCallback) {
    classCallCheck(this, AbstractQuery);
    this[_AbstractQueryTypeParametersSymbol] = {
      Store: t.typeParameter('Store', t.ref(AbstractStore))
    };

    this.store = store;
    this.queryCallback = queryCallback;
  }

  createClass(AbstractQuery, [{
    key: 'fetchAndSubscribe',
    value: function fetchAndSubscribe(callback) {
      var _callbackType = t.function();

      t.param('callback', _callbackType).assert(callback);

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return this._subscribe(callback, true, args);
    }
  }, {
    key: 'subscribe',
    value: function subscribe(callback) {
      var _callbackType2 = t.function();

      t.param('callback', _callbackType2).assert(callback);

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return this._subscribe(callback, false, args);
    }
  }]);
  return AbstractQuery;
}(), _class$2[t.TypeParametersSymbol] = _AbstractQueryTypeParametersSymbol, _temp$2);

exports.AbstractConnection = AbstractConnection;
exports.AbstractCursor = AbstractCursor;
exports.AbstractQuery = AbstractQuery;
exports.AbstractStore = AbstractStore;
exports.InsertType = InsertType;
exports.UpdateType = UpdateType;
exports.ResultType = ResultType;
exports.CursorInterfaceType = CursorInterfaceType;
exports.StoreInterfaceType = StoreInterfaceType;
//# sourceMappingURL=index-browser-dev.cjs.js.map
