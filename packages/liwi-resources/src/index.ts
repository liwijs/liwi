import { BaseModel } from 'liwi-types';
import ResourceInterface from './Resource';

export { default as AbstractClient } from './AbstractClient';
export { default as ResourcesService } from './ResourcesService';

export type Resource<
  Model extends BaseModel,
  Transformed = any,
  ConnectedUser = any
> = ResourceInterface<Model, Transformed, ConnectedUser>;

export type ResourceOperationKey =
  | 'findByKey'
  | 'findOne'
  | 'upsertOne'
  | 'insertOne'
  | 'replaceOne'
  | 'replaceSeveral'
  | 'upsertOneWithInfo'
  | 'partialUpdateByKey'
  | 'partialUpdateMany'
  | 'deleteByKey'
  | 'deleteMany'
  | 'fetch'
  | 'subscribe'
  | 'fetchAndSubscribe'
  | 'cursor'
  | 'cursor toArray';
