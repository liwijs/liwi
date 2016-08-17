var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

        if (!(connection instanceof MongoConnection)) {
            throw new TypeError('Value of argument "connection" violates contract.\n\nExpected:\nMongoConnection\n\nGot:\n' + _inspect(connection));
        }

        if (!(typeof collectionName === 'string')) {
            throw new TypeError('Value of argument "collectionName" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(collectionName));
        }

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MongoStore).call(this, connection));

        _this.keyPath = '_id';


        if (!collectionName) {
            throw new Error('Invalid collectionName: "' + collectionName + '"');
        }

        _this._collection = connection.getConnection().then(function (db) {
            if (!(db instanceof Db)) {
                throw new TypeError('Value of argument "db" violates contract.\n\nExpected:\nDb\n\nGot:\n' + _inspect(db));
            }

            return _this._collection = db.collection(collectionName);

            if (!(_this._collection instanceof Collection || _this._collection instanceof Promise)) {
                throw new TypeError('Value of "this._collection" violates contract.\n\nExpected:\nCollection | Promise<Collection>\n\nGot:\n' + _inspect(_this._collection));
            }
        });

        if (!(_this._collection instanceof Collection || _this._collection instanceof Promise)) {
            throw new TypeError('Value of "this._collection" violates contract.\n\nExpected:\nCollection | Promise<Collection>\n\nGot:\n' + _inspect(_this._collection));
        }

        return _this;
    }

    _createClass(MongoStore, [{
        key: 'insertOne',
        value: function insertOne(object) {
            function _ref2(_id2) {
                if (!(_id2 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<ModelType>\n\nGot:\n' + _inspect(_id2));
                }

                return _id2;
            }

            if (!object._id) {
                object._id = new ObjectID().toString();
            }
            if (!object.created) {
                object.created = new Date();
            }

            return _ref2(this.collection.then(function (collection) {
                return collection.insertOne(object);
            }).then(function (_ref12) {
                var result = _ref12.result;
                var connection = _ref12.connection;
                var ops = _ref12.ops;

                if (!result.ok || result.n !== 1) {
                    throw new Error('Fail to insert');
                }
            }).then(function () {
                return object;
            }));
        }
    }, {
        key: 'updateOne',
        value: function updateOne(object) {
            function _ref3(_id3) {
                if (!(_id3 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<ModelType>\n\nGot:\n' + _inspect(_id3));
                }

                return _id3;
            }

            if (!object.updated) {
                object.updated = new Date();
            }

            return _ref3(this.collection.then(function (collection) {
                return collection.updateOne({ _id: object._id }, object);
            }).then(function () {
                return object;
            }));
        }
    }, {
        key: 'upsertOne',
        value: function upsertOne(object) {
            function _ref4(_id4) {
                if (!(_id4 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<ModelType>\n\nGot:\n' + _inspect(_id4));
                }

                return _id4;
            }

            if (!object.updated) {
                object.updated = new Date();
            }

            return _ref4(this.collection.then(function (collection) {
                return collection.updateOne({ _id: object._id }, { $set: object }, { upsert: true });
            }).then(function () {
                return object;
            }));
        }
    }, {
        key: 'updateSeveral',
        value: function updateSeveral(objects) {
            var _this2 = this;

            function _ref5(_id5) {
                if (!(_id5 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<Array<ModelType>>\n\nGot:\n' + _inspect(_id5));
                }

                return _id5;
            }

            if (!Array.isArray(objects)) {
                throw new TypeError('Value of argument "objects" violates contract.\n\nExpected:\nArray<ModelType>\n\nGot:\n' + _inspect(objects));
            }

            return _ref5(Promise.all(objects.map(function (object) {
                return _this2.updateOne(object);
            })));
        }
    }, {
        key: '_partialUpdate',
        value: function _partialUpdate(partialUpdate) {
            if (!(partialUpdate instanceof Object)) {
                throw new TypeError('Value of argument "partialUpdate" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(partialUpdate));
            }

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
            function _ref6(_id6) {
                if (!(_id6 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id6));
                }

                return _id6;
            }

            if (!(partialUpdate instanceof Object)) {
                throw new TypeError('Value of argument "partialUpdate" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(partialUpdate));
            }

            partialUpdate = this._partialUpdate(partialUpdate);
            return _ref6(this.collection.then(function (collection) {
                return collection.updateOne({ _id: key }, partialUpdate);
            }));
        }
    }, {
        key: 'partialUpdateOne',
        value: function partialUpdateOne(object, partialUpdate) {
            var _this3 = this;

            function _ref7(_id7) {
                if (!(_id7 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<ModelType>\n\nGot:\n' + _inspect(_id7));
                }

                return _id7;
            }

            if (!(partialUpdate instanceof Object)) {
                throw new TypeError('Value of argument "partialUpdate" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(partialUpdate));
            }

            partialUpdate = this._partialUpdate(partialUpdate);
            return _ref7(this.partialUpdateByKey(object._id, partialUpdate).then(function (res) {
                return _this3.findByKey(object._id);
            }));
        }
    }, {
        key: 'partialUpdateMany',
        value: function partialUpdateMany(criteria, partialUpdate) {
            function _ref8(_id8) {
                if (!(_id8 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id8));
                }

                return _id8;
            }

            if (!(partialUpdate instanceof Object)) {
                throw new TypeError('Value of argument "partialUpdate" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(partialUpdate));
            }

            partialUpdate = this._partialUpdate(partialUpdate);
            return _ref8(this.collection.then(function (collection) {
                return collection.updateMany(criteria, partialUpdate);
            }).then(function (res) {
                return null;
            })); // TODO return updated object
        }
    }, {
        key: 'deleteByKey',
        value: function deleteByKey(key) {
            function _ref9(_id9) {
                if (!(_id9 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id9));
                }

                return _id9;
            }

            return _ref9(this.collection.then(function (collection) {
                return collection.removeOne({ _id: key });
            }).then(function () {
                return null;
            }));
        }
    }, {
        key: 'cursor',
        value: function cursor(criteria, sort) {
            var _this4 = this;

            function _ref10(_id10) {
                if (!(_id10 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<MongoCursor<ModelType>>\n\nGot:\n' + _inspect(_id10));
                }

                return _id10;
            }

            if (!(criteria == null || criteria instanceof Object)) {
                throw new TypeError('Value of argument "criteria" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(criteria));
            }

            if (!(sort == null || sort instanceof Object)) {
                throw new TypeError('Value of argument "sort" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(sort));
            }

            return _ref10(this.collection.then(function (collection) {
                return collection.find(criteria);
            }).then(sort && function (cursor) {
                return cursor.sort(sort);
            }).then(function (cursor) {
                return new MongoCursor(_this4, cursor);
            }));
        }
    }, {
        key: 'findByKey',
        value: function findByKey(key) {
            return this.findOne({ _id: key });
        }
    }, {
        key: 'findOne',
        value: function findOne(criteria, sort) {
            function _ref11(_id11) {
                if (!(_id11 instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<Object>\n\nGot:\n' + _inspect(_id11));
                }

                return _id11;
            }

            if (!(criteria instanceof Object)) {
                throw new TypeError('Value of argument "criteria" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(criteria));
            }

            if (!(sort == null || sort instanceof Object)) {
                throw new TypeError('Value of argument "sort" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(sort));
            }

            return _ref11(this.collection.then(function (collection) {
                return collection.find(criteria);
            }).then(sort && function (cursor) {
                return cursor.sort(sort);
            }).then(function (cursor) {
                return cursor.limit(1).next();
            }));
        }
    }, {
        key: 'collection',
        get: function get() {
            function _ref(_id) {
                if (!(_id instanceof Promise)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<Collection>\n\nGot:\n' + _inspect(_id));
                }

                return _id;
            }

            if (this.connection.connectionFailed) {
                return _ref(Promise.reject(new Error('MongoDB connection failed')));
            }

            return _ref(Promise.resolve(this._collection));
        }
    }]);

    return MongoStore;
}(AbstractStore);

export default MongoStore;

function _inspect(input, depth) {
    var maxDepth = 4;
    var maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input === 'undefined' ? 'undefined' : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(function (item) {
                    return _inspect(item, depth) === first;
                })) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(function (item) {
                            return _inspect(item, depth);
                        }).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        var indent = '  '.repeat(depth - 1);
        var entries = keys.slice(0, maxKeys).map(function (key) {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}
//# sourceMappingURL=MongoStore.js.map