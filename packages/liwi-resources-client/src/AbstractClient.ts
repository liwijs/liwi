import { InternalCommonStoreClient, UpsertResult } from 'liwi-store';
import {
  BaseModel,
  Criteria,
  InsertType,
  Sort,
  Update,
  QueryOptions,
  ResourceOperationKey,
} from 'liwi-types';
import ClientCursor from './ClientCursor';
import ClientQuery from './ClientQuery';

type UnsubscribeCallback = () => void;

export default abstract class AbstractClient<
  Model extends BaseModel,
  KeyPath extends string
>
  implements
    InternalCommonStoreClient<Model, KeyPath, ClientCursor<Model, KeyPath>> {
  readonly resourceName: string;

  readonly keyPath: KeyPath;

  constructor(resourceName: string, keyPath: KeyPath) {
    this.resourceName = resourceName;

    if (!resourceName) {
      throw new Error(`Invalid resourceName: "${resourceName}"`);
    }

    this.keyPath = keyPath;
  }

  createQuery(key: string): ClientQuery<Model, KeyPath> {
    return new ClientQuery(this, key);
  }

  abstract createCursor(options: QueryOptions<Model>): Promise<number>;

  abstract send<T>(key: ResourceOperationKey, ...args: any[]): Promise<T>;

  abstract on(event: string, listener: Function): void;

  abstract off(event: string, listener: Function): void;

  abstract emitSubscribe(
    type: string,
    ...args: any[]
  ): Promise<UnsubscribeCallback>;

  cursor(
    criteria?: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<ClientCursor<Model, KeyPath>> {
    return Promise.resolve(new ClientCursor(this, { criteria, sort }));
  }

  findAll(criteria?: Criteria<Model>, sort?: Sort<Model>): Promise<any[]> {
    return this.send('cursor toArray', { criteria, sort });
  }

  findByKey(key: any): Promise<Model | undefined> {
    return this.send('findByKey', key);
  }

  findOne(
    criteria: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<Model | undefined> {
    return this.send('findOne', criteria, sort);
  }

  upsertOne(object: InsertType<Model, KeyPath>): Promise<Model> {
    return this.send('upsertOne', object);
  }

  insertOne(object: Model): Promise<Model> {
    return this.send('insertOne', object);
  }

  replaceOne(object: Model): Promise<Model> {
    return this.send('replaceOne', object);
  }

  replaceSeveral(objects: Model[]): Promise<Model[]> {
    return this.send('replaceSeveral', objects);
  }

  upsertOneWithInfo(
    object: InsertType<Model, KeyPath>,
  ): Promise<UpsertResult<Model>> {
    return this.send('upsertOneWithInfo', object);
  }

  partialUpdateByKey(key: any, partialUpdate: Update<Model>): Promise<Model> {
    return this.send('partialUpdateByKey', key, partialUpdate);
  }

  partialUpdateOne(
    object: Model,
    partialUpdate: Update<Model>,
  ): Promise<Model> {
    return this.partialUpdateByKey(object[this.keyPath], partialUpdate);
  }

  partialUpdateMany(
    criteria: Criteria<Model>,
    partialUpdate: Update<Model>,
  ): Promise<void> {
    return this.send('partialUpdateMany', criteria, partialUpdate);
  }

  deleteByKey(key: any): Promise<void> {
    return this.send('deleteByKey', key);
  }

  deleteOne(object: Model): Promise<void> {
    return this.send('deleteByKey', object[this.keyPath]);
  }

  deleteMany(criteria: Criteria<Model>): Promise<void> {
    return this.send('deleteMany', criteria);
  }
}
