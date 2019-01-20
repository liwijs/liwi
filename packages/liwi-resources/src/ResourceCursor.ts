import { AbstractCursor } from 'liwi-store';
import { BaseModel } from 'liwi-types';
import Resource from './Resource';

export default class ResourceCursor<
  Model extends BaseModel,
  Transformed = any,
  ConnectedUser = any
> {
  private resource: Resource<Model, Transformed, ConnectedUser>;

  private connectedUser: any;

  private cursor: AbstractCursor<Model, any, any>;

  constructor(
    resource: Resource<Model, Transformed, ConnectedUser>,
    cursor: AbstractCursor<Model, any, any>,
    connectedUser?: ConnectedUser,
  ) {
    this.resource = resource;
    this.connectedUser = connectedUser;
    this.cursor = cursor;
  }

  toArray(): Promise<Array<Transformed>> {
    return this.cursor
      .toArray()
      .then((results: Array<Model>) =>
        results.map((result) =>
          this.resource.transform(result, this.connectedUser),
        ),
      );
  }
}
