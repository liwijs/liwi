import type Collection from 'mongodb/lib/collection';
import type MongoConnection from './MongoConnection';
import AbstractStore from '../store/AbstractStore';
import MongoCursor from './MongoCursor';
import { ObjectID } from 'mongodb';

export default class MongoStore<ModelType> extends AbstractStore<MongoConnection> {
    _collection: Collection|Promise<Collection>;

    constructor(connection: MongoConnection, collectionName: string) {
        super(connection);

        if (!collectionName) {
            throw new Error(`Invalid collectionName: "${collectionName}"`);
        }

        this._collection = connection.getConnection()
            .then(connection => this._collection = connection.collection(collectionName));
    }

    get collection(): Promise<Collection> {
        return Promise.resolve(this._collection);
    }

    insertOne(object: ModelType): Promise<ModelType> {
        if (!object._id) {
            object._id = (new ObjectID()).toString();
        }
        if (!object.created) {
            object.created = new Date();
        }

        return Promise.resolve(this._collection)
            .then(collection => collection.insertOne(object))
            .then(({ result, connection, ops }) => {
                if (!result.ok || result.n !== 1) {
                    throw new Error('Fail to insert');
                }
            })
            .then(() => object);
    }

    updateOne(object: ModelType): Promise<ModelType> {
        if (!object.updated) {
            object.updated = new Date();
        }

        return Promise.resolve(this._collection)
            .then(collection => collection.updateOne({ _id: object._id }, object))
            .then(() => object);
    }

    updateSeveral(objects: Array<ModelType>): Promise<ModelType> {
        return Promise.all(objects.map(object => this.updateOne(object)));
    }

    _partialUpdate(partialUpdate: Object) {
        // https://docs.mongodb.com/manual/reference/operator/update/
        // if has a mongo operator
        if (Object.keys(partialUpdate).some(key => key[0] === '$')) {
            return partialUpdate;
        } else {
            return { $set: partialUpdate };
        }
    }

    partialUpdateByKey(key: any, partialUpdate: Object): Promise {
        partialUpdate = this._partialUpdate(partialUpdate);
        return Promise.resolve(this._collection)
            .then(collection => collection.updateOne({ _id: key }, partialUpdate));
    }

    partialUpdateOne(object: ModelType, partialUpdate: Object): Promise<ModelType> {
        partialUpdate = this._partialUpdate(partialUpdate);
        return this.partialUpdateByKey(object._id, partialUpdate)
            .then(res => this.findByKey(object._id));
    }

    partialUpdateMany(criteria, partialUpdate: Object): Promise {
        partialUpdate = this._partialUpdate(partialUpdate);
        return Promise.resolve(this._collection)
            .then(collection => collection.updateMany(criteria, partialUpdate))
            .then(res => null); // TODO return updated object
    }

    deleteByKey(key: any): Promise {
        return Promise.resolve(this._collection)
            .then(collection => collection.removeOne({ _id: key }))
            .then(() => null);
    }

    deleteOne(object: ModelType): Promise {
        return this.deleteByKey(object._id);
    }


    cursor(criteria: Object): MongoCursor<ModelType> {
        return Promise.resolve(this._collection)
            .then(collection => collection.find())
            .then(cursor => new MongoCursor(this, cursor, criteria));
    }

    findByKey(key: any) {
        return this.findOne({ _id: key });
    }

    findOne(criteria: Object) {
        return Promise.resolve(this._collection)
            .then(collection => collection.find(criteria).limit(1).next());
    }
}
