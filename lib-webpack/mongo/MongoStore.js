var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { ObjectID } from 'mongodb';
import Collection from 'mongodb/lib/collection';
import Db from 'mongodb/lib/db';
import MongoConnection from './MongoConnection';
import AbstractStore from '../store/AbstractStore';
import MongoCursor from './MongoCursor';

var MongoStore = function (_AbstractStore) {
    _inherits(MongoStore, _AbstractStore);

    function MongoStore(connection, collectionName) {
        _classCallCheck(this, MongoStore);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MongoStore).call(this, connection));

        _this.keyPath = '_id';


        if (!collectionName) {
            throw new Error('Invalid collectionName: "' + collectionName + '"');
        }

        _this._collection = connection.getConnection().then(function (db) {
            return _this._collection = db.collection(collectionName);
        });
        return _this;
    }

    _createClass(MongoStore, [{
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
        value: function updateOne(object) {
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
        key: 'updateSeveral',
        value: function updateSeveral(objects) {
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
        value: function partialUpdateByKey(key, partialUpdate) {
            partialUpdate = this._partialUpdate(partialUpdate);
            return this.collection.then(function (collection) {
                return collection.updateOne({ _id: key }, partialUpdate);
            });
        }
    }, {
        key: 'partialUpdateOne',
        value: function partialUpdateOne(object, partialUpdate) {
            var _this3 = this;

            partialUpdate = this._partialUpdate(partialUpdate);
            return this.partialUpdateByKey(object._id, partialUpdate).then(function (res) {
                return _this3.findByKey(object._id);
            });
        }
    }, {
        key: 'partialUpdateMany',
        value: function partialUpdateMany(criteria, partialUpdate) {
            partialUpdate = this._partialUpdate(partialUpdate);
            return this.collection.then(function (collection) {
                return collection.updateMany(criteria, partialUpdate);
            }).then(function (res) {
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

export default MongoStore;
//# sourceMappingURL=MongoStore.js.map