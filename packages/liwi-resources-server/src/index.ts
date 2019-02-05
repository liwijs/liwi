import { BaseModel } from 'liwi-types';
import ResourceInterface from './Resource';

export { default as ResourcesServerService } from './ResourcesServerService';

export type Resource<
  Model extends BaseModel,
  Transformed = any,
  ConnectedUser = any
> = ResourceInterface<Model, Transformed, ConnectedUser>;
