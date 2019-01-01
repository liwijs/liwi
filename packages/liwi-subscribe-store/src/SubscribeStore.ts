import {
  Store as StoreInterface,
  AbstractConnection,
  AbstractCursor,
  UpsertResult,
} from 'liwi-store';
import { BaseModel, InsertType, Update, Criteria, Sort } from 'liwi-types';
import AbstractSubscribeQuery from './AbstractSubscribeQuery';

export type Actions<Model> =
  | { type: 'inserted'; next: Array<Model> }
  | { type: 'updated'; prev: Array<Model>; next: Array<Model> }
  | { type: 'deleted'; prev: Array<Model> };

export type Listener<Model> = (action: Actions<Model>) => void;

export default class SubscribeStore<
  Model extends BaseModel,
  KeyPath extends string,
  Connection extends AbstractConnection,
  Cursor extends AbstractCursor<Model, KeyPath, any>,
  Store extends StoreInterface<Model, KeyPath, Connection, Cursor, any>,
  Query extends AbstractSubscribeQuery<
    Model,
    StoreInterface<Model, KeyPath, Connection, Cursor, any>
  >
> implements StoreInterface<Model, KeyPath, Connection, Cursor, Query> {
  private store: Store;

  private listeners: Set<Listener<Model>> = new Set();

  constructor(store: Store) {
    this.store = store;
  }

  get keyPath() {
    return this.store.keyPath;
  }

  get connection(): Connection {
    return this.store.connection;
  }

  subscribe(callback: Listener<Model>) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  callSubscribed(action: Actions<Model>) {
    this.listeners.forEach((listener) => listener(action));
  }

  createQuery(criteria: any): Query {
    const query: Query = this.store.createQuery(criteria);
    query.setSubscribeStore(this);
    return query;
  }

  findAll(
    criteria?: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<Array<Model>> {
    return this.store.findAll(criteria, sort);
  }

  findByKey(key: any): Promise<Model | undefined> {
    return this.store.findByKey(key);
  }

  findOne(
    criteria: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<Model | undefined> {
    return this.store.findOne(criteria, sort);
  }

  async insertOne(object: InsertType<Model, KeyPath>): Promise<Model> {
    const inserted = await this.store.insertOne(object);
    this.callSubscribed({ type: 'inserted', next: [inserted] });
    return inserted;
  }

  async replaceOne(object: Model): Promise<Model> {
    const replaced = await this.store.replaceOne(object);
    this.callSubscribed({ type: 'updated', prev: [object], next: [replaced] });
    return replaced;
  }

  async replaceSeveral(objects: Array<Model>): Promise<Array<Model>> {
    const replacedObjects = await this.store.replaceSeveral(objects);
    this.callSubscribed({
      type: 'updated',
      prev: objects,
      next: replacedObjects,
    });
    return replacedObjects;
  }

  async upsertOne(object: InsertType<Model, KeyPath>): Promise<Model> {
    const result = await this.upsertOneWithInfo(object);
    return result.object;
  }

  async upsertOneWithInfo(
    object: InsertType<Model, KeyPath>,
  ): Promise<UpsertResult<Model>> {
    const upsertedWithInfo = await this.store.upsertOneWithInfo(object);
    if (upsertedWithInfo.inserted) {
      this.callSubscribed({
        type: 'inserted',
        next: [upsertedWithInfo.object],
      });
    } else {
      throw new Error('TODO');
    }
    return upsertedWithInfo;
  }

  async partialUpdateByKey(
    key: any,
    partialUpdate: Update<Model>,
  ): Promise<Model> {
    return this.partialUpdateOne(
      (await this.findByKey(key)) as Model,
      partialUpdate,
    );
  }

  async partialUpdateOne(
    object: Model,
    partialUpdate: Update<Model>,
  ): Promise<Model> {
    const updated = await this.store.partialUpdateOne(object, partialUpdate);
    this.callSubscribed({ type: 'updated', prev: [object], next: [updated] });
    return updated;
  }

  partialUpdateMany(
    criteria: Criteria<Model>,
    partialUpdate: Update<Model>,
  ): Promise<void> {
    throw new Error('partialUpdateMany cannot be used in SubscribeStore');
    // return this.store.partialUpdateMany(criteria, partialUpdate);
  }

  async deleteByKey(key: any): Promise<void> {
    return this.deleteOne((await this.findByKey(key)) as Model);
  }

  async deleteOne(object: Model): Promise<void> {
    await this.store.deleteOne(object);
    this.callSubscribed({ type: 'deleted', prev: [object] });
  }

  deleteMany(criteria: Criteria<Model>): Promise<void> {
    throw new Error('deleteMany cannot be used in SubscribeStore');
  }

  async cursor(
    criteria?: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<Cursor> {
    const cursor = await this.store.cursor(criteria, sort);
    cursor.overrideStore(this);
    return cursor;
  }
}