import { InternalCommonStoreClient } from 'liwi-store';
import {
  BaseModel,
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
    InternalCommonStoreClient<
      Model,
      KeyPath,
      ClientCursor<Model, KeyPath, any>
    > {
  readonly resourceName: string;

  readonly keyPath: KeyPath;

  constructor(resourceName: string, keyPath: KeyPath) {
    this.resourceName = resourceName;

    if (!resourceName) {
      throw new Error(`Invalid resourceName: "${resourceName}"`);
    }

    this.keyPath = keyPath;
  }

  createQuery(key: string, params: any): ClientQuery<Model, KeyPath> {
    return new ClientQuery(this, key, params);
  }

  abstract createCursor(options: QueryOptions<Model>): Promise<number>;

  abstract send<T>(key: ResourceOperationKey, value: any): Promise<T>;

  abstract on(event: string, listener: Function): void;

  abstract off(event: string, listener: Function): void;

  abstract emitSubscribe(
    type: string,
    args: any[],
  ): Promise<UnsubscribeCallback>;

  // cursor(
  //   criteria?: Criteria<Model>,
  //   sort?: Sort<Model>,
  // ): Promise<ClientCursor<Model, KeyPath>> {
  //   return Promise.resolve(new ClientCursor(this, { criteria, sort }));
  // }

  findByKey(key: any): Promise<Model | undefined> {
    throw new Error('Use operations instead');
  }

  replaceOne(object: Model): Promise<Model> {
    throw new Error('Use operations instead');
  }

  partialUpdateByKey(key: any, partialUpdate: Update<Model>): Promise<Model> {
    throw new Error('Use operations instead');
  }

  deleteByKey(key: any): Promise<void> {
    throw new Error('Use operations instead');
  }
}
