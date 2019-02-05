import { BaseModel } from 'liwi-types';
import ClientQuery from './ClientQuery';

export { default as AbstractClient } from './AbstractClient';

export type ResourcesClientService<
  Queries extends string,
  Model extends BaseModel,
  KeyPath extends string = '_id'
> = Record<Queries, ClientQuery<Model, KeyPath>>;
