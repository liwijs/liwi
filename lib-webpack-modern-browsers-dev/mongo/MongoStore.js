import { ObjectID } from 'mongodb';
import Collection from 'mongodb/lib/collection';
import Db from 'mongodb/lib/db';
import MongoConnection from './MongoConnection';
import AbstractStore from '../store/AbstractStore';
import MongoCursor from './MongoCursor';

export default class MongoStore extends AbstractStore {

    constructor(connection, collectionName) {
        if (!(connection instanceof MongoConnection)) {
            throw new TypeError('Value of argument "connection" violates contract.\n\nExpected:\nMongoConnection\n\nGot:\n' + _inspect(connection));
        }

        if (!(typeof collectionName === 'string')) {
            throw new TypeError('Value of argument "collectionName" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(collectionName));
        }

        super(connection);

        this.keyPath = '_id';
        if (!collectionName) {
            throw new Error(`Invalid collectionName: "${ collectionName }"`);
        }

        this._collection = connection.getConnection().then(db => {
            if (!(db instanceof Db)) {
                throw new TypeError('Value of argument "db" violates contract.\n\nExpected:\nDb\n\nGot:\n' + _inspect(db));
            }

            return this._collection = db.collection(collectionName);

            if (!(this._collection instanceof Collection || this._collection instanceof Promise)) {
                throw new TypeError('Value of "this._collection" violates contract.\n\nExpected:\nCollection | Promise<Collection>\n\nGot:\n' + _inspect(this._collection));
            }
        });

        if (!(this._collection instanceof Collection || this._collection instanceof Promise)) {
            throw new TypeError('Value of "this._collection" violates contract.\n\nExpected:\nCollection | Promise<Collection>\n\nGot:\n' + _inspect(this._collection));
        }
    }

    get collection() {
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

    insertOne(object) {
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

        return _ref2(this.collection.then(collection => {
            return collection.insertOne(object);
        }).then(_ref11 => {
            var result = _ref11.result;
            var connection = _ref11.connection;
            var ops = _ref11.ops;

            if (!result.ok || result.n !== 1) {
                throw new Error('Fail to insert');
            }
        }).then(() => {
            return object;
        }));
    }

    updateOne(object) {
        function _ref3(_id3) {
            if (!(_id3 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<ModelType>\n\nGot:\n' + _inspect(_id3));
            }

            return _id3;
        }

        if (!object.updated) {
            object.updated = new Date();
        }

        return _ref3(this.collection.then(collection => {
            return collection.updateOne({ _id: object._id }, object);
        }).then(() => {
            return object;
        }));
    }

    updateSeveral(objects) {
        function _ref4(_id4) {
            if (!(_id4 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<Array<ModelType>>\n\nGot:\n' + _inspect(_id4));
            }

            return _id4;
        }

        if (!Array.isArray(objects)) {
            throw new TypeError('Value of argument "objects" violates contract.\n\nExpected:\nArray<ModelType>\n\nGot:\n' + _inspect(objects));
        }

        return _ref4(Promise.all(objects.map(object => {
            return this.updateOne(object);
        })));
    }

    _partialUpdate(partialUpdate) {
        if (!(partialUpdate instanceof Object)) {
            throw new TypeError('Value of argument "partialUpdate" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(partialUpdate));
        }

        // https://docs.mongodb.com/manual/reference/operator/update/
        // if has a mongo operator
        if (Object.keys(partialUpdate).some(key => {
            return key[0] === '$';
        })) {
            return partialUpdate;
        } else {
            return { $set: partialUpdate };
        }
    }

    partialUpdateByKey(key, partialUpdate) {
        function _ref5(_id5) {
            if (!(_id5 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id5));
            }

            return _id5;
        }

        if (!(partialUpdate instanceof Object)) {
            throw new TypeError('Value of argument "partialUpdate" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(partialUpdate));
        }

        partialUpdate = this._partialUpdate(partialUpdate);
        return _ref5(this.collection.then(collection => {
            return collection.updateOne({ _id: key }, partialUpdate);
        }));
    }

    partialUpdateOne(object, partialUpdate) {
        function _ref6(_id6) {
            if (!(_id6 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<ModelType>\n\nGot:\n' + _inspect(_id6));
            }

            return _id6;
        }

        if (!(partialUpdate instanceof Object)) {
            throw new TypeError('Value of argument "partialUpdate" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(partialUpdate));
        }

        partialUpdate = this._partialUpdate(partialUpdate);
        return _ref6(this.partialUpdateByKey(object._id, partialUpdate).then(res => {
            return this.findByKey(object._id);
        }));
    }

    partialUpdateMany(criteria, partialUpdate) {
        function _ref7(_id7) {
            if (!(_id7 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id7));
            }

            return _id7;
        }

        if (!(partialUpdate instanceof Object)) {
            throw new TypeError('Value of argument "partialUpdate" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(partialUpdate));
        }

        partialUpdate = this._partialUpdate(partialUpdate);
        return _ref7(this.collection.then(collection => {
            return collection.updateMany(criteria, partialUpdate);
        }).then(res => {
            return null;
        })); // TODO return updated object
    }

    deleteByKey(key) {
        function _ref8(_id8) {
            if (!(_id8 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id8));
            }

            return _id8;
        }

        return _ref8(this.collection.then(collection => {
            return collection.removeOne({ _id: key });
        }).then(() => {
            return null;
        }));
    }

    cursor(criteria, sort) {
        function _ref9(_id9) {
            if (!(_id9 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<MongoCursor<ModelType>>\n\nGot:\n' + _inspect(_id9));
            }

            return _id9;
        }

        if (!(criteria == null || criteria instanceof Object)) {
            throw new TypeError('Value of argument "criteria" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(criteria));
        }

        if (!(sort == null || sort instanceof Object)) {
            throw new TypeError('Value of argument "sort" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(sort));
        }

        return _ref9(this.collection.then(collection => {
            return collection.find(criteria);
        }).then(sort && (cursor => {
            return cursor.sort(sort);
        })).then(cursor => {
            return new MongoCursor(this, cursor);
        }));
    }

    findByKey(key) {
        return this.findOne({ _id: key });
    }

    findOne(criteria, sort) {
        function _ref10(_id10) {
            if (!(_id10 instanceof Promise)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<Object>\n\nGot:\n' + _inspect(_id10));
            }

            return _id10;
        }

        if (!(criteria instanceof Object)) {
            throw new TypeError('Value of argument "criteria" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(criteria));
        }

        if (!(sort == null || sort instanceof Object)) {
            throw new TypeError('Value of argument "sort" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(sort));
        }

        return _ref10(this.collection.then(collection => {
            return collection.find(criteria);
        }).then(sort && (cursor => {
            return cursor.sort(sort);
        })).then(cursor => {
            return cursor.limit(1).next();
        }));
    }
}

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
        return typeof input;
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(item => _inspect(item, depth) === first)) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if (typeof _ret === "object") return _ret.v;
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
        var entries = keys.slice(0, maxKeys).map(key => {
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