'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var liwiStore = require('liwi-store');

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

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var SubscribeStore =
/*#__PURE__*/
function () {
  function SubscribeStore(store) {
    this.listeners = new Set();
    this.store = store;
  }

  var _proto = SubscribeStore.prototype;

  _proto.subscribe = function subscribe(callback) {
    var _this = this;

    this.listeners.add(callback);
    return function () {
      return _this.listeners.delete(callback);
    };
  };

  _proto.callSubscribed = function callSubscribed(action) {
    this.listeners.forEach(function (listener) {
      return listener(action);
    });
  };

  _proto.createQuery = function createQuery(options, transformer) {
    var query = this.store.createQuery(options, transformer);
    query.setSubscribeStore(this);
    return query;
  };

  _proto.findAll = function findAll(criteria, sort) {
    return this.store.findAll(criteria, sort);
  };

  _proto.findByKey = function findByKey(key) {
    return this.store.findByKey(key);
  };

  _proto.findOne = function findOne(criteria, sort) {
    return this.store.findOne(criteria, sort);
  };

  _proto.insertOne =
  /*#__PURE__*/
  function () {
    var _insertOne = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(object) {
      var inserted;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.store.insertOne(object);

            case 2:
              inserted = _context.sent;
              this.callSubscribed({
                type: 'inserted',
                next: [inserted]
              });
              return _context.abrupt("return", inserted);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function insertOne() {
      return _insertOne.apply(this, arguments);
    };
  }();

  _proto.replaceOne =
  /*#__PURE__*/
  function () {
    var _replaceOne = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(object) {
      var replaced;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.store.replaceOne(object);

            case 2:
              replaced = _context2.sent;
              this.callSubscribed({
                type: 'updated',
                prev: [object],
                next: [replaced]
              });
              return _context2.abrupt("return", replaced);

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function replaceOne() {
      return _replaceOne.apply(this, arguments);
    };
  }();

  _proto.replaceSeveral =
  /*#__PURE__*/
  function () {
    var _replaceSeveral = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(objects) {
      var replacedObjects;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.store.replaceSeveral(objects);

            case 2:
              replacedObjects = _context3.sent;
              this.callSubscribed({
                type: 'updated',
                prev: objects,
                next: replacedObjects
              });
              return _context3.abrupt("return", replacedObjects);

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function replaceSeveral() {
      return _replaceSeveral.apply(this, arguments);
    };
  }();

  _proto.upsertOne =
  /*#__PURE__*/
  function () {
    var _upsertOne = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(object) {
      var result;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return this.upsertOneWithInfo(object);

            case 2:
              result = _context4.sent;
              return _context4.abrupt("return", result.object);

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function upsertOne() {
      return _upsertOne.apply(this, arguments);
    };
  }();

  _proto.upsertOneWithInfo =
  /*#__PURE__*/
  function () {
    var _upsertOneWithInfo = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(object) {
      var upsertedWithInfo;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return this.store.upsertOneWithInfo(object);

            case 2:
              upsertedWithInfo = _context5.sent;

              if (!upsertedWithInfo.inserted) {
                _context5.next = 7;
                break;
              }

              this.callSubscribed({
                type: 'inserted',
                next: [upsertedWithInfo.object]
              });
              _context5.next = 8;
              break;

            case 7:
              throw new Error('TODO');

            case 8:
              return _context5.abrupt("return", upsertedWithInfo);

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function upsertOneWithInfo() {
      return _upsertOneWithInfo.apply(this, arguments);
    };
  }();

  _proto.partialUpdateByKey =
  /*#__PURE__*/
  function () {
    var _partialUpdateByKey = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(key, partialUpdate) {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.t0 = this;
              _context6.next = 3;
              return this.findByKey(key);

            case 3:
              _context6.t1 = _context6.sent;
              _context6.t2 = partialUpdate;
              return _context6.abrupt("return", _context6.t0.partialUpdateOne.call(_context6.t0, _context6.t1, _context6.t2));

            case 6:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    return function partialUpdateByKey() {
      return _partialUpdateByKey.apply(this, arguments);
    };
  }();

  _proto.partialUpdateOne =
  /*#__PURE__*/
  function () {
    var _partialUpdateOne = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7(object, partialUpdate) {
      var updated;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return this.store.partialUpdateOne(object, partialUpdate);

            case 2:
              updated = _context7.sent;
              this.callSubscribed({
                type: 'updated',
                prev: [object],
                next: [updated]
              });
              return _context7.abrupt("return", updated);

            case 5:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    return function partialUpdateOne() {
      return _partialUpdateOne.apply(this, arguments);
    };
  }();

  _proto.partialUpdateMany = function partialUpdateMany() {
    throw new Error('partialUpdateMany cannot be used in SubscribeStore'); // return this.store.partialUpdateMany(criteria, partialUpdate);
  };

  _proto.deleteByKey =
  /*#__PURE__*/
  function () {
    var _deleteByKey = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8(key) {
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.t0 = this;
              _context8.next = 3;
              return this.findByKey(key);

            case 3:
              _context8.t1 = _context8.sent;
              return _context8.abrupt("return", _context8.t0.deleteOne.call(_context8.t0, _context8.t1));

            case 5:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    return function deleteByKey() {
      return _deleteByKey.apply(this, arguments);
    };
  }();

  _proto.deleteOne =
  /*#__PURE__*/
  function () {
    var _deleteOne = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9(object) {
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return this.store.deleteOne(object);

            case 2:
              this.callSubscribed({
                type: 'deleted',
                prev: [object]
              });

            case 3:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    return function deleteOne() {
      return _deleteOne.apply(this, arguments);
    };
  }();

  _proto.deleteMany = function deleteMany() {
    throw new Error('deleteMany cannot be used in SubscribeStore');
  };

  _proto.cursor =
  /*#__PURE__*/
  function () {
    var _cursor = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10(criteria, sort) {
      var cursor;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return this.store.cursor(criteria, sort);

            case 2:
              cursor = _context10.sent;
              cursor.overrideStore(this);
              return _context10.abrupt("return", cursor);

            case 5:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, this);
    }));

    return function cursor() {
      return _cursor.apply(this, arguments);
    };
  }();

  _createClass(SubscribeStore, [{
    key: "keyPath",
    get: function get() {
      return this.store.keyPath;
    }
  }, {
    key: "connection",
    get: function get() {
      return this.store.connection;
    }
  }]);

  return SubscribeStore;
}();

var AbstractSubscribeQuery =
/*#__PURE__*/
function (_AbstractQuery) {
  _inheritsLoose(AbstractSubscribeQuery, _AbstractQuery);

  function AbstractSubscribeQuery() {
    return _AbstractQuery.apply(this, arguments) || this;
  }

  var _proto = AbstractSubscribeQuery.prototype;

  _proto.setSubscribeStore = function setSubscribeStore(store) {
    this._subscribeStore = store;
  };

  _proto.getSubscribeStore = function getSubscribeStore() {
    if (!this._subscribeStore) {
      throw new Error('_subscribeStore is not initialized');
    }

    return this._subscribeStore;
  };

  return AbstractSubscribeQuery;
}(liwiStore.AbstractQuery);

exports.SubscribeStore = SubscribeStore;
exports.AbstractSubscribeQuery = AbstractSubscribeQuery;
//# sourceMappingURL=index-browser.cjs.js.map
