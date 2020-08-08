'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/esm/asyncToGenerator'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/esm/createClass'));

var AbstractSubscribableStoreQuery = /*#__PURE__*/function () {
  function AbstractSubscribableStoreQuery() {}

  var _proto = AbstractSubscribableStoreQuery.prototype;

  _proto.changeParams = function changeParams() {
    throw new Error('Method not supported. Please create a new query.');
  };

  _proto.changePartialParams = function changePartialParams() {
    throw new Error('Method not supported. Please create a new query.');
  };

  _proto.setSubscribeStore = function setSubscribeStore(store) {
    this._subscribeStore = store;
  };

  _proto.getSubscribeStore = function getSubscribeStore() {
    if (!this._subscribeStore) {
      throw new Error('_subscribeStore is not initialized');
    }

    return this._subscribeStore;
  };

  _proto.fetchAndSubscribe = function fetchAndSubscribe(callback) {
    return this._subscribe(callback, true);
  };

  _proto.subscribe = function subscribe(callback) {
    return this._subscribe(callback, false);
  };

  return AbstractSubscribableStoreQuery;
}();

/* eslint-disable max-lines */
var SubscribeStore = /*#__PURE__*/function () {
  function SubscribeStore(store) {
    this.listeners = new Set();
    this.store = store;
    this.keyPath = store.keyPath;
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

  _proto.createQuerySingleItem = function createQuerySingleItem(options, transformer) {
    var query = this.store.createQuerySingleItem(options, transformer);
    query.setSubscribeStore(this);
    return query;
  };

  _proto.createQueryCollection = function createQueryCollection(options, transformer) {
    var query = this.store.createQueryCollection(options, transformer);
    query.setSubscribeStore(this);
    return query;
  };

  _proto.findAll = function findAll(criteria, sort) {
    return this.store.findAll(criteria, sort);
  };

  _proto.findByKey = function findByKey(key, criteria) {
    return this.store.findByKey(key, criteria);
  };

  _proto.findOne = function findOne(criteria, sort) {
    return this.store.findOne(criteria, sort);
  };

  _proto.insertOne = /*#__PURE__*/function () {
    var _insertOne = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(object) {
      var inserted;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
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

  _proto.replaceOne = /*#__PURE__*/function () {
    var _replaceOne = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(object) {
      var replaced;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.store.replaceOne(object);

            case 2:
              replaced = _context2.sent;
              this.callSubscribed({
                type: 'updated',
                changes: [[object, replaced]]
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

  _proto.replaceSeveral = /*#__PURE__*/function () {
    var _replaceSeveral = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(objects) {
      var replacedObjects;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.store.replaceSeveral(objects);

            case 2:
              replacedObjects = _context3.sent;
              this.callSubscribed({
                type: 'updated',
                changes: objects.map(function (prev, index) {
                  return [prev, replacedObjects[index]];
                })
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

  _proto.upsertOne = /*#__PURE__*/function () {
    var _upsertOne = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(object) {
      var result;
      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
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

  _proto.upsertOneWithInfo = /*#__PURE__*/function () {
    var _upsertOneWithInfo = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(object) {
      var upsertedWithInfo;
      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
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

  _proto.partialUpdateByKey = /*#__PURE__*/function () {
    var _partialUpdateByKey = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(key, partialUpdate, criteria) {
      var _Object$assign;

      return _regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.t0 = this;
              _context6.next = 3;
              return this.findOne(Object.assign((_Object$assign = {}, _Object$assign[this.store.keyPath] = key, _Object$assign), criteria));

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

  _proto.partialUpdateOne = /*#__PURE__*/function () {
    var _partialUpdateOne = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(object, partialUpdate) {
      var updated;
      return _regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return this.store.partialUpdateOne(object, partialUpdate);

            case 2:
              updated = _context7.sent;
              this.callSubscribed({
                type: 'updated',
                changes: [[object, updated]]
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

  _proto.partialUpdateMany = /*#__PURE__*/function () {
    var _partialUpdateMany = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(criteria, partialUpdate) {
      var _this2 = this;

      var cursor, changes;
      return _regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return this.store.cursor(criteria);

            case 2:
              cursor = _context9.sent;
              changes = [];
              _context9.next = 6;
              return cursor.forEach( /*#__PURE__*/function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(model) {
                  var key, updated;
                  return _regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                      switch (_context8.prev = _context8.next) {
                        case 0:
                          key = model[_this2.store.keyPath];
                          _context8.next = 3;
                          return _this2.store.partialUpdateByKey(key, partialUpdate, criteria);

                        case 3:
                          updated = _context8.sent;
                          changes.push([model, updated]);

                        case 5:
                        case "end":
                          return _context8.stop();
                      }
                    }
                  }, _callee8);
                }));

                return function () {
                  return _ref.apply(this, arguments);
                };
              }());

            case 6:
              this.callSubscribed({
                type: 'updated',
                changes: changes
              });

            case 7:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    return function partialUpdateMany() {
      return _partialUpdateMany.apply(this, arguments);
    };
  }();

  _proto.deleteByKey = /*#__PURE__*/function () {
    var _deleteByKey = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10(key, criteria) {
      return _regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.t0 = this;
              _context10.next = 3;
              return this.findByKey(key, criteria);

            case 3:
              _context10.t1 = _context10.sent;
              return _context10.abrupt("return", _context10.t0.deleteOne.call(_context10.t0, _context10.t1));

            case 5:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, this);
    }));

    return function deleteByKey() {
      return _deleteByKey.apply(this, arguments);
    };
  }();

  _proto.deleteOne = /*#__PURE__*/function () {
    var _deleteOne = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee11(object) {
      return _regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return this.store.deleteOne(object);

            case 2:
              this.callSubscribed({
                type: 'deleted',
                prev: [object]
              });

            case 3:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, this);
    }));

    return function deleteOne() {
      return _deleteOne.apply(this, arguments);
    };
  }();

  _proto.deleteMany = /*#__PURE__*/function () {
    var _deleteMany = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee12(criteria) {
      var cursor, prev;
      return _regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return this.store.cursor(criteria);

            case 2:
              cursor = _context12.sent;
              _context12.next = 5;
              return cursor.toArray();

            case 5:
              prev = _context12.sent;
              _context12.next = 8;
              return this.store.deleteMany(criteria);

            case 8:
              this.callSubscribed({
                type: 'deleted',
                prev: prev
              });

            case 9:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, this);
    }));

    return function deleteMany() {
      return _deleteMany.apply(this, arguments);
    };
  }();

  _proto.cursor = /*#__PURE__*/function () {
    var _cursor = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee13(criteria, sort) {
      var cursor;
      return _regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return this.store.cursor(criteria, sort);

            case 2:
              cursor = _context13.sent;
              cursor.overrideStore(this);
              return _context13.abrupt("return", cursor);

            case 5:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, this);
    }));

    return function cursor() {
      return _cursor.apply(this, arguments);
    };
  }();

  _createClass(SubscribeStore, [{
    key: "connection",
    get: function get() {
      return this.store.connection;
    }
  }]);

  return SubscribeStore;
}();

exports.AbstractSubscribableStoreQuery = AbstractSubscribableStoreQuery;
exports.SubscribeStore = SubscribeStore;
//# sourceMappingURL=index-browser.cjs.js.map
