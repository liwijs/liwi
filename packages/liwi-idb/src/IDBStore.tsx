import { IDBInsertType } from './IDBBaseModel';
import type {
  UpsertResult,
  SubscribableStore,
  QueryParams,
  UpsertPartialObject,
  Criteria,
  Sort,
  Update,
  QueryOptions,
  Transformer,
  AllowedKeyValue,
  OptionalBaseModelKeysForInsert,
} from 'liwi-store';

export class IDBStore<
  Model extends IDBBaseModel<KeyValue>,
  KeyPath extends keyof Model,
  KeyValue extends AllowedKeyValue,
  // KeyValue extends AllowedKeyValue = Model[MongoKeyPath],
> implements
    SubscribableStore<
      KeyPath,
      KeyValue,
      Model,
      IDBInsertType<Model, KeyPath>,
      IDBConnection
    >
{
  readonly keyPath: KeyPath;

  readonly connection: IDBConnection;

  private _collection: Collection<Model> | Promise<Collection<Model>>;

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

  get collection(): Promise<Collection<Model>> {
    if (this.connection.connectionFailed) {
      return Promise.reject(new Error('MongoDB connection failed'));
    }

    return Promise.resolve(this._collection);
  }

  createQuerySingleItem<
    Result extends Record<MongoKeyPath, KeyValue> = Model,
    Params extends QueryParams<Params> = never,
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
    Params extends QueryParams<Params> = never,
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
      object._id = new mongodb.ObjectId().toString() as Model['_id'];
    }

    if (!object.created) object.created = new Date();
    if (!object.updated) object.updated = new Date();

    const collection = await this.collection;
    const { acknowledged: isAcknowledged } = await collection.insertOne(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      object as any,
    );
    if (!isAcknowledged) {
      throw new Error('Fail to insert');
    }

    return object as Model;
  }

  async replaceOne(object: Model): Promise<Model> {
    if (!object.updated) object.updated = new Date();

    const collection = await this.collection;
    await collection.replaceOne({ _id: object._id } as Criteria<Model>, object);
    return object;
  }

  async upsertOne<
    K extends Exclude<
      keyof Model,
      MongoKeyPath | OptionalBaseModelKeysForInsert
    >,
  >(
    object: UpsertPartialObject<MongoKeyPath, KeyValue, Model, K>,
    setOnInsertPartialObject?: Update<Model>['$setOnInsert'],
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
    >,
  >(
    object: UpsertPartialObject<MongoKeyPath, KeyValue, Model, K>,
    setOnInsertPartialObject?: Update<Model>['$setOnInsert'],
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
      { _id: object._id } as Criteria<Model>,
      { $set, $setOnInsert } as UpdateFilter<Model>,
      { upsert: true },
    );

    if (upsertedCount) {
      Object.assign(object, $setOnInsert);
    }

    return { object: object as unknown as Model, inserted: !!upsertedCount };
  }

  replaceSeveral(objects: Model[]): Promise<Model[]> {
    return Promise.all(objects.map((object: Model) => this.replaceOne(object)));
  }

  async partialUpdateByKey(
    key: KeyValue,
    partialUpdate: Update<Model>,
    criteria?: Criteria<Model>,
  ): Promise<Model> {
    const collection = await this.collection;
    const commandResult = await collection.updateOne(
      { _id: key, ...criteria } as Criteria<Model>,
      partialUpdate as UpdateFilter<Model>,
    );
    if (!commandResult.acknowledged) {
      console.error(commandResult);
      throw new Error('Update failed');
    }
    const object = await this.findByKey(key);
    return object!;
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
      .then((collection) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        collection.updateMany(criteria, partialUpdate as any),
      )
      .then((res) => undefined); // TODO return updated object
  }

  deleteByKey(key: KeyValue, criteria?: Criteria<Model>): Promise<void> {
    return this.collection
      .then((collection) =>
        collection.deleteOne({ _id: key, ...criteria } as Criteria<Model>),
      )
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

  async count(filter?: Criteria<Model>): Promise<number> {
    const collection = await this.collection;
    return filter
      ? collection.countDocuments(filter)
      : collection.countDocuments();
  }

  async cursor<Result extends Partial<Model> = Model>(
    filter?: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<MongoCursor<Model, Result, KeyValue>> {
    const collection = await this.collection;
    const findCursor = filter
      ? collection.find<Result>(filter)
      : (collection.find() as unknown as FindCursor<Result>);
    if (sort) findCursor.sort(sort);
    return new MongoCursor<Model, Result, KeyValue>(this, findCursor);
  }

  async findByKey(
    key: KeyValue,
    criteria?: Criteria<Model>,
  ): Promise<Model | undefined> {
    const collection = await this.collection;
    const result = await collection.findOne<Model>({
      _id: key,
      ...criteria,
    } as Criteria<Model>);
    return result || undefined;
  }

  findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<Model[]> {
    return this.cursor<Model>(criteria, sort).then((cursor) =>
      cursor.toArray(),
    );
  }

  async findOne(
    filter: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<Model | undefined> {
    const collection = await this.collection;
    const result = await collection.findOne<Model>(filter, {
      sort,
    });
    return result || undefined;
  }
}
