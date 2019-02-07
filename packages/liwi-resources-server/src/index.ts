import { BaseModel } from 'liwi-types';
import { OperationDescriptions, QueryDescriptions } from 'liwi-resources';
import ServiceResourceInterface from './ServiceResource';
import CursorResourceInterface from './CursorResource';

export { default as ResourcesServerService } from './ResourcesServerService';

export type ServiceResource<
  Queries extends QueryDescriptions,
  Operations extends OperationDescriptions,
  ConnectedUser = any
> = ServiceResourceInterface<Queries, Operations, ConnectedUser>;

export type CursorResource<
  Model extends BaseModel,
  Transformed = any,
  ConnectedUser = any
> = CursorResourceInterface<Model, Transformed, ConnectedUser>;
