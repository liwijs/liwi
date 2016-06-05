'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _AbstractStore = require('../store/AbstractStore');

var _AbstractStore2 = _interopRequireDefault(_AbstractStore);

var _MongoCursor = require('./MongoCursor');

var _MongoCursor2 = _interopRequireDefault(_MongoCursor);

var _mongodb = require('mongodb');

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let MongoStore = class MongoStore extends _AbstractStore2.default {
    /**
     * @param {MongoConnection} connection
     * @param {string} collectionName
    */

    constructor(connection, collectionName) {
        super(connection);

        if (!collectionName) {
            throw new Error(`Invalid collectionName: "${ collectionName }"`);
        }

        this._collection = connection.getConnection().then(db => this._collection = db.collection(collectionName));
    }

    /**
     * @member {Promise.<Collection>} collection
    */get collection() {
        if (this.connection.connectionFailed) {
            return Promise.reject(new Error('MongoDB connection failed'));
        }

        return Promise.resolve(this._collection);
    }

    /**
     * @param {ModelType} object
     * @returns {Promise.<ModelType>}
    */insertOne(object) {
        if (!object._id) {
            object._id = new _mongodb.ObjectID().toString();
        }
        if (!object.created) {
            object.created = new Date();
        }

        return this.collection.then(collection => collection.insertOne(object)).then(_ref => {
            let result = _ref.result;
            let connection = _ref.connection;
            let ops = _ref.ops;

            if (!result.ok || result.n !== 1) {
                throw new Error('Fail to insert');
            }
        }).then(() => object);
    }

    /**
     * @param {ModelType} object
     * @returns {Promise.<ModelType>}
    */updateOne(object) {
        if (!object.updated) {
            object.updated = new Date();
        }

        return this.collection.then(collection => collection.updateOne({ _id: object._id }, object)).then(() => object);
    }

    /**
     * @param {Array.<ModelType>} objects
     * @returns {Promise.<ModelType>}
    */updateSeveral(objects) {
        return Promise.all(objects.map(object => this.updateOne(object)));
    }

    /**
     * @param {Object} partialUpdate
    */_partialUpdate(partialUpdate) {
        // https://docs.mongodb.com/manual/reference/operator/update/
        // if has a mongo operator
        if (Object.keys(partialUpdate).some(key => key[0] === '$')) {
            return partialUpdate;
        } else {
            return { $set: partialUpdate };
        }
    }

    /**
     * @param {*} key
     * @param {Object} partialUpdate
     * @returns {Promise}
    */partialUpdateByKey(key, partialUpdate) {
        partialUpdate = this._partialUpdate(partialUpdate);
        return this.collection.then(collection => collection.updateOne({ _id: key }, partialUpdate));
    }

    /**
     * @param {ModelType} object
     * @param {Object} partialUpdate
     * @returns {Promise.<ModelType>}
    */partialUpdateOne(object, partialUpdate) {
        partialUpdate = this._partialUpdate(partialUpdate);
        return this.partialUpdateByKey(object._id, partialUpdate).then(res => this.findByKey(object._id));
    }

    /**
     * @param criteria
     * @param {Object} partialUpdate
     * @returns {Promise}
    */partialUpdateMany(criteria, partialUpdate) {
        partialUpdate = this._partialUpdate(partialUpdate);
        return this.collection.then(collection => collection.updateMany(criteria, partialUpdate)).then(res => null); // TODO return updated object
    }

    /**
     * @param {*} key
     * @returns {Promise}
    */deleteByKey(key) {
        return this.collection.then(collection => collection.removeOne({ _id: key })).then(() => null);
    }

    /**
     * @param {ModelType} object
     * @returns {Promise}
    */deleteOne(object) {
        return this.deleteByKey(object._id);
    }

    /**
     * @param {Object} criteria
     * @param {*} sort
     * @returns {MongoCursor.<ModelType>}
    */cursor(criteria, sort) {
        return this.collection.then(collection => collection.find(criteria)).then(sort && (cursor => cursor.sort(sort))).then(cursor => new _MongoCursor2.default(this, cursor));
    }

    /**
     * @param {*} key
    */findByKey(key) {
        return this.findOne({ _id: key });
    }

    /**
     * @param {Object} criteria
     * @returns {Promise.<*>}
    */findOne(criteria) {
        return this.collection.then(collection => collection.find(criteria).limit(1).next());
    }
};
exports.default = MongoStore;
//# sourceMappingURL=MongoStore.js.map