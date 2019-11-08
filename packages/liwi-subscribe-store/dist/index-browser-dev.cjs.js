'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/esm/createClass'));
var _inheritsLoose = _interopDefault(require('@babel/runtime/helpers/esm/inheritsLoose'));
var liwiStore = require('liwi-store');

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

  _proto.findByKey = function findByKey(key, criteria) {
    return this.store.findByKey(key, criteria);
  };

  _proto.findOne = function findOne(criteria, sort) {
    return this.store.findOne(criteria, sort);
  };

  _proto.insertOne = function insertOne(object) {
    var inserted;
    return _regeneratorRuntime.async(function insertOne$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _regeneratorRuntime.awrap(this.store.insertOne(object));

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
    }, null, this);
  };

  _proto.replaceOne = function replaceOne(object) {
    var replaced;
    return _regeneratorRuntime.async(function replaceOne$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _regeneratorRuntime.awrap(this.store.replaceOne(object));

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
    }, null, this);
  };

  _proto.replaceSeveral = function replaceSeveral(objects) {
    var replacedObjects;
    return _regeneratorRuntime.async(function replaceSeveral$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _regeneratorRuntime.awrap(this.store.replaceSeveral(objects));

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
    }, null, this);
  };

  _proto.upsertOne = function upsertOne(object) {
    var result;
    return _regeneratorRuntime.async(function upsertOne$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _regeneratorRuntime.awrap(this.upsertOneWithInfo(object));

          case 2:
            result = _context4.sent;
            return _context4.abrupt("return", result.object);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, null, this);
  };

  _proto.upsertOneWithInfo = function upsertOneWithInfo(object) {
    var upsertedWithInfo;
    return _regeneratorRuntime.async(function upsertOneWithInfo$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _regeneratorRuntime.awrap(this.store.upsertOneWithInfo(object));

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
    }, null, this);
  };

  _proto.partialUpdateByKey = function partialUpdateByKey(key, partialUpdate, criteria) {
    var _Object$assign;

    return _regeneratorRuntime.async(function partialUpdateByKey$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.t0 = this;
            _context6.next = 3;
            return _regeneratorRuntime.awrap(this.findOne(Object.assign((_Object$assign = {}, _Object$assign[this.store.keyPath] = key, _Object$assign), criteria)));

          case 3:
            _context6.t1 = _context6.sent;
            _context6.t2 = partialUpdate;
            return _context6.abrupt("return", _context6.t0.partialUpdateOne.call(_context6.t0, _context6.t1, _context6.t2));

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    }, null, this);
  };

  _proto.partialUpdateOne = function partialUpdateOne(object, partialUpdate) {
    var updated;
    return _regeneratorRuntime.async(function partialUpdateOne$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _regeneratorRuntime.awrap(this.store.partialUpdateOne(object, partialUpdate));

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
    }, null, this);
  };

  _proto.partialUpdateMany = function partialUpdateMany(criteria, partialUpdate) {
    var _this2 = this;

    var cursor, prev, next;
    return _regeneratorRuntime.async(function partialUpdateMany$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _regeneratorRuntime.awrap(this.store.cursor(criteria));

          case 2:
            cursor = _context9.sent;
            prev = [];
            next = [];
            _context9.next = 7;
            return _regeneratorRuntime.awrap(cursor.forEach(function _callee(model) {
              var key, updated;
              return _regeneratorRuntime.async(function _callee$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      key = model[_this2.store.keyPath];
                      _context8.next = 3;
                      return _regeneratorRuntime.awrap(_this2.store.partialUpdateByKey(key, partialUpdate, criteria));

                    case 3:
                      updated = _context8.sent;
                      prev.push(model);
                      next.push(updated);

                    case 6:
                    case "end":
                      return _context8.stop();
                  }
                }
              });
            }));

          case 7:
            this.callSubscribed({
              type: 'updated',
              prev: prev,
              next: next
            });

          case 8:
          case "end":
            return _context9.stop();
        }
      }
    }, null, this);
  };

  _proto.deleteByKey = function deleteByKey(key, criteria) {
    return _regeneratorRuntime.async(function deleteByKey$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.t0 = this;
            _context10.next = 3;
            return _regeneratorRuntime.awrap(this.findByKey(key, criteria));

          case 3:
            _context10.t1 = _context10.sent;
            return _context10.abrupt("return", _context10.t0.deleteOne.call(_context10.t0, _context10.t1));

          case 5:
          case "end":
            return _context10.stop();
        }
      }
    }, null, this);
  };

  _proto.deleteOne = function deleteOne(object) {
    return _regeneratorRuntime.async(function deleteOne$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return _regeneratorRuntime.awrap(this.store.deleteOne(object));

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
    }, null, this);
  };

  _proto.deleteMany = function deleteMany(criteria) {
    var cursor, prev;
    return _regeneratorRuntime.async(function deleteMany$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return _regeneratorRuntime.awrap(this.store.cursor(criteria));

          case 2:
            cursor = _context12.sent;
            _context12.next = 5;
            return _regeneratorRuntime.awrap(cursor.toArray());

          case 5:
            prev = _context12.sent;
            _context12.next = 8;
            return _regeneratorRuntime.awrap(this.store.deleteMany(criteria));

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
    }, null, this);
  };

  _proto.cursor = function cursor(criteria, sort) {
    var cursor;
    return _regeneratorRuntime.async(function cursor$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return _regeneratorRuntime.awrap(this.store.cursor(criteria, sort));

          case 2:
            cursor = _context13.sent;
            cursor.overrideStore(this);
            return _context13.abrupt("return", cursor);

          case 5:
          case "end":
            return _context13.stop();
        }
      }
    }, null, this);
  };

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

exports.AbstractSubscribeQuery = AbstractSubscribeQuery;
exports.SubscribeStore = SubscribeStore;
//# sourceMappingURL=index-browser-dev.cjs.js.map
