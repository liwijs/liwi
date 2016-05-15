'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = /**
                    * @function
                   */ function () { /**
                                     * @function
                                     * @param target
                                     * @param props
                                    */ function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return (/**
                                                                                                                                                                                                                                                                                                                                                                            * @function
                                                                                                                                                                                                                                                                                                                                                                            * @param Constructor
                                                                                                                                                                                                                                                                                                                                                                            * @param protoProps
                                                                                                                                                                                                                                                                                                                                                                            * @param staticProps
                                                                                                                                                                                                                                                                                                                                                                           */ function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; } ); }();

var _AbstractStore2 = require('../store/AbstractStore');

var _AbstractStore3 = _interopRequireDefault(_AbstractStore2);

var _MongoCursor = require('./MongoCursor');

var _MongoCursor2 = _interopRequireDefault(_MongoCursor);

var _mongodb = require('mongodb');

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function
 * @param instance
 * @param Constructor
*/
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @function
 * @param self
 * @param call
*/
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

/**
 * @function
 * @param subClass
 * @param superClass
*/
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MongoStore = /**
                  * @function
                  * @param _AbstractStore
                 */function (_AbstractStore) {
    _inherits(MongoStore, _AbstractStore);

    /**
     * @function
     * @param {MongoConnection} connection
     * @param {string} collectionName
    */
    function MongoStore(connection, collectionName) {
        _classCallCheck(this, MongoStore);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MongoStore).call(this, connection));

        if (!collectionName) {
            throw new Error('Invalid collectionName: "' + collectionName + '"');
        }

        _this._collection = connection.getConnection().then(function (connection) {
            return _this._collection = connection.collection(collectionName);
        });
        return _this;
    }

    _createClass(MongoStore, [{
        key: 'insertOne',
        value: /**
                * @function
                * @param {ModelType} object
               */function insertOne(object) {
            if (!object._id) {
                object._id = new _mongodb.ObjectID().toString();
            }
            if (!object.created) {
                object.created = new Date();
            }

            return Promise.resolve(this._collection).then(function (collection) {
                return collection.insertOne(object);
            }).then(function (_ref) {
                var result = _ref.result;
                var connection = _ref.connection;
                var ops = _ref.ops;

                if (!result.ok || result.n !== 1) {
                    throw new Error('Fail to insert');
                }
            }).then(function () {
                return object;
            });
        }
    }, {
        key: 'updateOne',
        value: /**
                * @function
                * @param {ModelType} object
               */function updateOne(object) {
            if (!object.updated) {
                object.updated = new Date();
            }

            return Promise.resolve(this._collection).then(function (collection) {
                return collection.updateOne({ _id: object._id }, object);
            }).then(function () {
                return object;
            });
        }
    }, {
        key: 'updateSeveral',
        value: /**
                * @function
                * @param {Array.<ModelType>} objects
               */function updateSeveral(objects) {
            var _this2 = this;

            return Promise.all(objects.map(function (object) {
                return _this2.updateOne(object);
            }));
        }
    }, {
        key: '_partialUpdate',
        value: /**
                * @function
                * @param {Object} partialUpdate
               */function _partialUpdate(partialUpdate) {
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
        value: /**
                * @function
                * @param {*} key
                * @param {Object} partialUpdate
               */function partialUpdateByKey(key, partialUpdate) {
            partialUpdate = this._partialUpdate(partialUpdate);
            return Promise.resolve(this._collection).then(function (collection) {
                return collection.updateOne({ _id: key }, partialUpdate);
            });
        }
    }, {
        key: 'partialUpdateOne',
        value: /**
                * @function
                * @param {ModelType} object
                * @param {Object} partialUpdate
               */function partialUpdateOne(object, partialUpdate) {
            var _this3 = this;

            partialUpdate = this._partialUpdate(partialUpdate);
            return this.partialUpdateByKey(object._id, partialUpdate).then(function (res) {
                return _this3.findByKey(object._id);
            });
        }
    }, {
        key: 'partialUpdateMany',
        value: /**
                * @function
                * @param criteria
                * @param {Object} partialUpdate
               */function partialUpdateMany(criteria, partialUpdate) {
            partialUpdate = this._partialUpdate(partialUpdate);
            return Promise.resolve(this._collection).then(function (collection) {
                return collection.updateMany(criteria, partialUpdate);
            }).then(function (res) {
                return null;
            }); // TODO return updated object
        }
    }, {
        key: 'deleteByKey',
        value: /**
                * @function
                * @param {*} key
               */function deleteByKey(key) {
            return Promise.resolve(this._collection).then(function (collection) {
                return collection.removeOne({ _id: key });
            }).then(function () {
                return null;
            });
        }
    }, {
        key: 'deleteOne',
        value: /**
                * @function
                * @param {ModelType} object
               */function deleteOne(object) {
            return this.deleteByKey(object._id);
        }
    }, {
        key: 'cursor',
        value: /**
                * @function
                * @param {Object} criteria
               */function cursor(criteria) {
            var _this4 = this;

            return Promise.resolve(this._collection).then(function (collection) {
                return collection.find();
            }).then(function (cursor) {
                return new _MongoCursor2.default(_this4, cursor, criteria);
            });
        }
    }, {
        key: 'findByKey',
        value: /**
                * @function
                * @param {*} key
               */function findByKey(key) {
            return this.findOne({ _id: key });
        }
    }, {
        key: 'findOne',
        value: /**
                * @function
                * @param {Object} criteria
               */function findOne(criteria) {
            return Promise.resolve(this._collection).then(function (collection) {
                return collection.find(criteria).limit(1).next();
            });
        }
    }, {
        key: 'collection',
        get: /**
              * @function
             */function get() {
            return Promise.resolve(this._collection);
        }
    }]);

    return MongoStore;
}(_AbstractStore3.default);

exports.default = MongoStore;
//# sourceMappingURL=MongoStore.js.map