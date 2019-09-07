/* eslint-disable max-lines */
import { ObjectID, Collection, MongoClient } from 'mongodb';
import { AbstractStore, UpsertResult } from 'liwi-store';
import {
  BaseModel,
  InsertType,
  Criteria,
  Sort,
  Update,
  QueryOptions,
  Transformer,
} from 'liwi-types';
import MongoConnection from './MongoConnection';
import MongoCursor from './MongoCursor';
import MongoQuery from './MongoQuery';
import { MongoKeyPath } from '.';

export type MongoKeyPath = '_id';

export interface MongoModel extends BaseModel {
  _id: string;
}

export type MongoInsertType<Model extends MongoModel> = InsertType<
  Model,
  MongoKeyPath
>;

export interface MongoUpsertResult<Model extends MongoModel>
  extends UpsertResult<Model> {
  object: Model;
  inserted: boolean;
}

export default class MongoStore<Model extends MongoModel> extends AbstractStore<
  Model,
  MongoKeyPath,
  MongoConnection,
  MongoCursor<Model>
> {
  private _collection: Collection | Promise<Collection>;

  constructor(connection: MongoConnection, collectionName: string) {
    super(connection, '_id');

    if (!collectionName) {
      throw new Error(`Invalid collectionName: "${collectionName}"`);
    }

    this._collection = connection.getConnection().then(
      (client: MongoClient) => {
        this._collection = client.db().collection(collectionName);
        return this._collection;
      },
      (err: any) => {
        this._collection = Promise.reject(err);
        return this._collection;
      },
    );
  }

  get collection(): Promise<Collection> {
    if (super.connection.connectionFailed) {
      return Promise.reject(new Error('MongoDB connection failed'));
    }

    return Promise.resolve(this._collection);
  }

  createQuery<Transformed>(
    options: QueryOptions<Model>,
    transformer?: Transformer<Model, Transformed>,
  ): MongoQuery<Model, Transformed> {
    return new MongoQuery(this, options, transformer);
  }

  async insertOne(object: MongoInsertType<Model>): Promise<Model> {
    if (!object._id) {
      object._id = new ObjectID().toString();
    }

    if (!object.created) object.created = new Date();
    if (!object.updated) object.updated = new Date();

    const collection = await this.collection;
    const { result } = await collection.insertOne(object);
    if (!result.ok || result.n !== 1) {
      throw new Error('Fail to insert');
    }

    return object as Model;
  }

  async replaceOne(object: Model): Promise<Model> {
    if (!object.updated) object.updated = new Date();

    const collection = await this.collection;
    await collection.replaceOne({ _id: object._id }, object);
    return object as Model;
  }

  async upsertOneWithInfo(
    object: MongoInsertType<Model>,
  ): Promise<MongoUpsertResult<Model>> {
    const $setOnInsert = {
      created: object.created || new Date(),
    };

    if (!object.updated) object.updated = new Date();

    const $set = { ...object };
    delete $set.created;

    const collection = await this.collection;

    const { upsertedCount } = await collection.updateOne(
      { _id: object._id },
      { $set, $setOnInsert },
      { upsert: true },
    );

    if (upsertedCount) {
      object.created = $setOnInsert.created;
    }

    return { object: object as Model, inserted: !!upsertedCount };
  }

  replaceSeveral(objects: Model[]): Promise<Model[]> {
    return Promise.all(objects.map((object: Model) => this.replaceOne(object)));
  }

  async partialUpdateByKey(
    key: any,
    partialUpdate: Update<Model>,
    criteria?: Criteria<Model>,
  ): Promise<Model> {
    const collection = await this.collection;
    const commandResult = await collection.updateOne(
      { _id: key, ...criteria },
      partialUpdate,
    );
    if (!commandResult.result.ok) {
      console.error(commandResult);
      throw new Error('Update failed');
    }
    const object = await this.findByKey(key);
    return object as Model;
  }

  partialUpdateOne(
    object: Model,
    partialUpdate: Update<Model>,
  ): Promise<Model> {
    return this.partialUpdateByKey(object._id, partialUpdate);
  }

  partialUpdateMany(
    criteria: Criteria<Model>,
    partialUpdate: Update<Model>,
  ): Promise<void> {
    return this.collection
      .then((collection) => collection.updateMany(criteria, partialUpdate))
      .then((res) => undefined); // TODO return updated object
  }

  deleteByKey(key: any): Promise<void> {
    return this.collection
      .then((collection) => collection.deleteOne({ _id: key }))
      .then(() => undefined);
  }

  deleteMany(selector: Criteria<Model>): Promise<void> {
    return this.collection
      .then((collection) => collection.deleteMany(selector))
      .then(() => undefined);
  }

  cursor(
    criteria?: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<MongoCursor<Model>> {
    return this.collection
      .then((collection) => collection.find(criteria))
      .then(sort && ((cursor) => cursor.sort(sort)))
      .then((cursor) => new MongoCursor(this, cursor));
  }

  findByKey(key: any): Promise<Model | undefined> {
    return this.collection
      .then((collection) => collection.findOne({ _id: key }))
      .then((result) => result || undefined);
  }

  findOne(
    criteria: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<Model | undefined> {
    return this.collection
      .then((collection) => collection.find(criteria))
      .then(sort && ((cursor) => cursor.sort(sort)))
      .then((cursor) => cursor.limit(1).next());
  }
}
