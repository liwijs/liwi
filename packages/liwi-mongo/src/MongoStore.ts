/* eslint-disable max-lines */
import type {
  UpsertResult,
  SubscribableStore,
  QueryParams,
  UpsertPartialObject,
} from 'liwi-store';
import type {
  Criteria,
  Sort,
  Update,
  QueryOptions,
  Transformer,
  AllowedKeyValue,
  OptionalBaseModelKeysForInsert,
} from 'liwi-types';
import type { Collection, MongoClient } from 'mongodb';
import { ObjectID } from 'mongodb';
import type {
  MongoBaseModel,
  MongoKeyPath,
  MongoInsertType,
} from './MongoBaseModel';
import type MongoConnection from './MongoConnection';
import MongoCursor from './MongoCursor';
import MongoQueryCollection from './MongoQueryCollection';
import MongoQuerySingleItem from './MongoQuerySingleItem';

export interface MongoUpsertResult<
  KeyValue extends AllowedKeyValue,
  Model extends MongoBaseModel<KeyValue>
> extends UpsertResult<Model> {
  object: Model;
  inserted: boolean;
}

export default class MongoStore<
  Model extends MongoBaseModel<KeyValue>,
  KeyValue extends AllowedKeyValue = Model[MongoKeyPath]
> implements
    SubscribableStore<
      MongoKeyPath,
      KeyValue,
      Model,
      MongoInsertType<Model>,
      MongoConnection
    > {
  readonly keyPath: MongoKeyPath = '_id';

  readonly connection: MongoConnection;

  private _collection: Collection | Promise<Collection>;

  constructor(connection: MongoConnection, collectionName: string) {
    this.connection = connection;

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
    if (this.connection.connectionFailed) {
      return Promise.reject(new Error('MongoDB connection failed'));
    }

    return Promise.resolve(this._collection);
  }

  createQuerySingleItem<
    Result extends Record<MongoKeyPath, KeyValue> = Model,
    Params extends QueryParams<Params> = never
  >(
    options: QueryOptions<Model>,
    transformer?: Transformer<Model, Result>,
  ): MongoQuerySingleItem<Model, Params, Result, KeyValue> {
    return new MongoQuerySingleItem<Model, Params, Result, KeyValue>(
      this,
      options,
      transformer,
    );
  }

  createQueryCollection<
    Item extends Record<MongoKeyPath, KeyValue> = Model,
    Params extends QueryParams<Params> = never
  >(
    options: QueryOptions<Model>,
    transformer?: Transformer<Model, Item>,
  ): MongoQueryCollection<Model, Params, Model['_id'], Item> {
    return new MongoQueryCollection<Model, Params, KeyValue, Item>(
      this,
      options,
      transformer,
    );
  }

  async insertOne(object: MongoInsertType<Model>): Promise<Model> {
    if (!object._id) {
      object._id = new ObjectID().toString() as Model['_id'];
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

  async upsertOne<
    K extends Exclude<
      keyof Model,
      MongoKeyPath | OptionalBaseModelKeysForInsert
    >
  >(
    object: UpsertPartialObject<MongoKeyPath, KeyValue, Model, K>,
    setOnInsertPartialObject?: Pick<Model, K>,
  ): Promise<Model> {
    const result = await this.upsertOneWithInfo(
      object,
      setOnInsertPartialObject,
    );
    return result.object;
  }

  async upsertOneWithInfo<
    K extends Exclude<
      keyof Model,
      MongoKeyPath | OptionalBaseModelKeysForInsert
    >
  >(
    object: UpsertPartialObject<MongoKeyPath, KeyValue, Model, K>,
    setOnInsertPartialObject?: Pick<Model, K>,
  ): Promise<MongoUpsertResult<KeyValue, Model>> {
    const $setOnInsert = {
      created: object.created || new Date(),
      ...setOnInsertPartialObject,
    };

    if (!object.updated) {
      (object as MongoBaseModel).updated = new Date();
    }

    const $set: Partial<typeof object> = { ...object };
    delete $set.created;

    const collection = await this.collection;

    const { upsertedCount } = await collection.updateOne(
      { _id: object._id },
      { $set, $setOnInsert },
      { upsert: true },
    );

    if (upsertedCount) {
      Object.assign(object, $setOnInsert);
    }

    return { object: (object as unknown) as Model, inserted: !!upsertedCount };
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

  deleteByKey(key: any, criteria?: Criteria<Model>): Promise<void> {
    return this.collection
      .then((collection) => collection.deleteOne({ _id: key, ...criteria }))
      .then(() => undefined);
  }

  deleteOne(object: Model): Promise<void> {
    return this.deleteByKey(object._id);
  }

  deleteMany(selector: Criteria<Model>): Promise<void> {
    return this.collection
      .then((collection) => collection.deleteMany(selector))
      .then(() => undefined);
  }

  cursor<Result = Model>(
    criteria?: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<MongoCursor<Model, Result, KeyValue>> {
    return this.collection
      .then((collection) => collection.find(criteria))
      .then(sort && ((cursor) => cursor.sort(sort)))
      .then((cursor) => new MongoCursor(this, cursor));
  }

  findByKey(key: any, criteria?: Criteria<Model>): Promise<Model | undefined> {
    return this.collection
      .then((collection) => collection.findOne({ _id: key, ...criteria }))
      .then((result) => result || undefined);
  }

  findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Model[]> {
    return this.cursor<Model>(criteria, sort).then((cursor) =>
      cursor.toArray(),
    );
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
