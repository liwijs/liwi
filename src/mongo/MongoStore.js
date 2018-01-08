import { ObjectID } from 'mongodb';
import Collection from 'mongodb/lib/collection';
import Db from 'mongodb/lib/db';
import MongoConnection from './MongoConnection';
import AbstractStore from '../store/AbstractStore';
import MongoCursor from './MongoCursor';
import type { InsertType, UpdateType, ResultType } from '../types';

type MongoUpdateCommandResultType = {
  result: {| n: number, nModified: number, ok: number |},
  connection: any,
  modifiedCount: number,
  upsertedId: null,
  upsertedCount: number,
  matchedCount: number,
};

export default class MongoStore extends AbstractStore<MongoConnection> {
  _collection: Collection | Promise<Collection>;
  keyPath = '_id';

  constructor(connection: MongoConnection, collectionName: string) {
    super(connection);

    if (!collectionName) {
      throw new Error(`Invalid collectionName: "${collectionName}"`);
    }

    this._collection = connection
      .getConnection()
      .then((db: Db) => (this._collection = db.collection(collectionName)))
      .catch(err => (this._collection = Promise.reject(err)));
  }

  get collection(): Promise<Collection> {
    if (this.connection.connectionFailed) {
      return Promise.reject(new Error('MongoDB connection failed'));
    }

    return Promise.resolve(this._collection);
  }

  create(): Promise {
    return Promise.resolve();
  }

  insertOne(object: InsertType): Promise<ResultType> {
    if (!object._id) {
      object._id = new ObjectID().toString();
    }
    if (!object.created) {
      object.created = new Date();
    }

    return this.collection
      .then(collection => collection.insertOne(object))
      .then(({ result, connection, ops }) => {
        if (!result.ok || result.n !== 1) {
          throw new Error('Fail to insert');
        }
      })
      .then(() => object);
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object: InsertType): Promise<ResultType> {
    if (!object.updated) {
      object.updated = new Date();
    }

    return this.collection
      .then(collection => collection.updateOne({ _id: object._id }, object))
      .then(() => object);
  }

  upsertOne(object: InsertType): Promise<ResultType> {
    if (!object.updated) {
      object.updated = new Date();
    }

    return this.collection
      .then(collection =>
        collection.updateOne({ _id: object._id }, { $set: object }, { upsert: true }),
      )
      .then(() => object);
  }

  replaceSeveral(objects: Array<InsertType>): Promise<Array<ResultType>> {
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

  async partialUpdateByKey(key: any, partialUpdate: UpdateType): Promise<ResultType> {
    partialUpdate = this._partialUpdate(partialUpdate);
    const collection = await this.collection;
    const commandResult: MongoUpdateCommandResultType = await collection.updateOne(
      { _id: key },
      partialUpdate,
    );
    if (!commandResult.result.ok) {
      console.error(commandResult);
      throw new Error('Update failed');
    }
    return this.findByKey(key);
  }

  partialUpdateOne(object: ResultType, partialUpdate: UpdateType): Promise<ResultType> {
    partialUpdate = this._partialUpdate(partialUpdate);
    return this.partialUpdateByKey(object._id, partialUpdate);
  }

  partialUpdateMany(criteria, partialUpdate: UpdateType): Promise<void> {
    partialUpdate = this._partialUpdate(partialUpdate);
    return this.collection
      .then(collection => collection.updateMany(criteria, partialUpdate))
      .then(res => null); // TODO return updated object
  }

  deleteByKey(key: any): Promise<void> {
    return this.collection.then(collection => collection.removeOne({ _id: key })).then(() => null);
  }

  cursor(criteria: ?Object, sort: ?Object): Promise<MongoCursor<ResultType>> {
    return this.collection
      .then(collection => collection.find(criteria))
      .then(sort && (cursor => cursor.sort(sort)))
      .then(cursor => new MongoCursor(this, cursor));
  }

  findByKey(key: any): Promise<?ResultType> {
    return this.findOne({ _id: key });
  }

  findOne(criteria: Object, sort: ?Object): Promise<?ResultType> {
    return this.collection
      .then(collection => collection.find(criteria))
      .then(sort && (cursor => cursor.sort(sort)))
      .then(cursor => cursor.limit(1).next());
  }
}
