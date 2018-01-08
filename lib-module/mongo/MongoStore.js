var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { ObjectID } from 'mongodb';

import AbstractStore from '../store/AbstractStore';
import MongoCursor from './MongoCursor';

var MongoStore = function (_AbstractStore) {
  _inherits(MongoStore, _AbstractStore);

  function MongoStore(connection, collectionName) {
    _classCallCheck(this, MongoStore);

    var _this = _possibleConstructorReturn(this, (MongoStore.__proto__ || Object.getPrototypeOf(MongoStore)).call(this, connection));

    _this.keyPath = '_id';


    if (!collectionName) {
      throw new Error('Invalid collectionName: "' + collectionName + '"');
    }

    _this._collection = connection.getConnection().then(function (db) {
      return _this._collection = db.collection(collectionName);
    }).catch(function (err) {
      return _this._collection = Promise.reject(err);
    });
    return _this;
  }

  _createClass(MongoStore, [{
    key: 'create',
    value: function create() {
      return Promise.resolve();
    }
  }, {
    key: 'insertOne',
    value: function insertOne(object) {
      if (!object._id) {
        object._id = new ObjectID().toString();
      }
      if (!object.created) {
        object.created = new Date();
      }

      return this.collection.then(function (collection) {
        return collection.insertOne(object);
      }).then(function (_ref) {
        var result = _ref.result,
            connection = _ref.connection,
            ops = _ref.ops;

        if (!result.ok || result.n !== 1) {
          throw new Error('Fail to insert');
        }
      }).then(function () {
        return object;
      });
    }
  }, {
    key: 'updateOne',
    value: function updateOne(object) {
      return this.replaceOne(object);
    }
  }, {
    key: 'replaceOne',
    value: function replaceOne(object) {
      if (!object.updated) {
        object.updated = new Date();
      }

      return this.collection.then(function (collection) {
        return collection.updateOne({ _id: object._id }, object);
      }).then(function () {
        return object;
      });
    }
  }, {
    key: 'upsertOne',
    value: function upsertOne(object) {
      if (!object.updated) {
        object.updated = new Date();
      }

      return this.collection.then(function (collection) {
        return collection.updateOne({ _id: object._id }, { $set: object }, { upsert: true });
      }).then(function () {
        return object;
      });
    }
  }, {
    key: 'replaceSeveral',
    value: function replaceSeveral(objects) {
      var _this2 = this;

      return Promise.all(objects.map(function (object) {
        return _this2.updateOne(object);
      }));
    }
  }, {
    key: '_partialUpdate',
    value: function _partialUpdate(partialUpdate) {
      // https://docs.mongodb.com/manual/reference/operator/update/
      // if has a mongo operator
      if (Object.keys(partialUpdate).some(function (key) {
        return key[0] === '$';
      })) {
        return partialUpdate;
      } else {
        return { $set: partialUpdate };
      }
    }
  }, {
    key: 'partialUpdateByKey',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(key, partialUpdate) {
        var collection, commandResult;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                partialUpdate = this._partialUpdate(partialUpdate);
                _context.next = 3;
                return this.collection;

              case 3:
                collection = _context.sent;
                _context.next = 6;
                return collection.updateOne({ _id: key }, partialUpdate);

              case 6:
                commandResult = _context.sent;

                if (commandResult.result.ok) {
                  _context.next = 10;
                  break;
                }

                console.error(commandResult);
                throw new Error('Update failed');

              case 10:
                return _context.abrupt('return', this.findByKey(key));

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function partialUpdateByKey() {
        return _ref2.apply(this, arguments);
      };
    }()
  }, {
    key: 'partialUpdateOne',
    value: function partialUpdateOne(object, partialUpdate) {
      var _this3 = this;

      partialUpdate = this._partialUpdate(partialUpdate);
      return this.partialUpdateByKey(object._id, partialUpdate).then(function () {
        return _this3.findByKey(object._id);
      });
    }
  }, {
    key: 'partialUpdateMany',
    value: function partialUpdateMany(criteria, partialUpdate) {
      partialUpdate = this._partialUpdate(partialUpdate);
      return this.collection.then(function (collection) {
        return collection.updateMany(criteria, partialUpdate);
      }).then(function () {
        return null;
      }); // TODO return updated object
    }
  }, {
    key: 'deleteByKey',
    value: function deleteByKey(key) {
      return this.collection.then(function (collection) {
        return collection.removeOne({ _id: key });
      }).then(function () {
        return null;
      });
    }
  }, {
    key: 'cursor',
    value: function cursor(criteria, sort) {
      var _this4 = this;

      return this.collection.then(function (collection) {
        return collection.find(criteria);
      }).then(sort && function (cursor) {
        return cursor.sort(sort);
      }).then(function (cursor) {
        return new MongoCursor(_this4, cursor);
      });
    }
  }, {
    key: 'findByKey',
    value: function findByKey(key) {
      return this.findOne({ _id: key });
    }
  }, {
    key: 'findOne',
    value: function findOne(criteria, sort) {
      return this.collection.then(function (collection) {
        return collection.find(criteria);
      }).then(sort && function (cursor) {
        return cursor.sort(sort);
      }).then(function (cursor) {
        return cursor.limit(1).next();
      });
    }
  }, {
    key: 'collection',
    get: function get() {
      if (this.connection.connectionFailed) {
        return Promise.reject(new Error('MongoDB connection failed'));
      }

      return Promise.resolve(this._collection);
    }
  }]);

  return MongoStore;
}(AbstractStore);

export { MongoStore as default };
//# sourceMappingURL=MongoStore.js.map