'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

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

var AbstractCursor = function () {
  function AbstractCursor(store) {
    classCallCheck(this, AbstractCursor);

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
    value: function limit() {
      throw new Error('limit() missing implementation');
    }
  }, {
    key: 'count',
    value: function count() {

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
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(callback) {
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
      }));

      return function forEachKeys() {
        return _ref.apply(this, arguments);
      };
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
      return this._store;
    }
  }]);
  return AbstractCursor;
}(); /* eslint-disable no-await-in-loop */

var AbstractQuery = function () {
  function AbstractQuery(store, queryCallback) {
    classCallCheck(this, AbstractQuery);

    this.store = store;
    this.queryCallback = queryCallback;
  }

  createClass(AbstractQuery, [{
    key: 'fetchAndSubscribe',
    value: function fetchAndSubscribe(callback) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return this._subscribe(callback, true, args);
    }
  }, {
    key: 'subscribe',
    value: function subscribe(callback) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return this._subscribe(callback, false, args);
    }
  }]);
  return AbstractQuery;
}(); // eslint-disable-next-line no-unused-vars

var AbstractStore = function () {
  /**
   * @param {AbstractConnection} connection
   */
  function AbstractStore(connection) {
    classCallCheck(this, AbstractStore);

    assert(connection);
    this._connection = connection;
  }

  createClass(AbstractStore, [{
    key: 'findAll',
    value: function findAll(criteria, sort) {
      return this.cursor(criteria, sort).then(function (cursor) {
        return cursor.toArray();
      });
    }
  }, {
    key: 'connection',
    get: function get$$1() {
      return this._connection;
    }
  }]);
  return AbstractStore;
}();

exports.AbstractConnection = AbstractConnection;
exports.AbstractCursor = AbstractCursor;
exports.AbstractQuery = AbstractQuery;
exports.AbstractStore = AbstractStore;
//# sourceMappingURL=index-browser.cjs.js.map
