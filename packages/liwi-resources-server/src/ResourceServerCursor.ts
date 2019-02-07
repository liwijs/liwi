import { AbstractStoreCursor } from 'liwi-store';
import { BaseModel } from 'liwi-types';
import Resource from './Resource';

export default class ResourceServerCursor<
  Model extends BaseModel,
  Transformed = any,
  ConnectedUser = any
> {
  private resource: Resource<Model, any, any, Transformed, ConnectedUser>;

  private connectedUser: any;

  private cursor: AbstractStoreCursor<Model, any, any>;

  constructor(
    resource: Resource<Model, any, any, Transformed, ConnectedUser>,
    cursor: AbstractStoreCursor<Model, any, any>,
    connectedUser?: ConnectedUser,
  ) {
    this.resource = resource;
    this.connectedUser = connectedUser;
    this.cursor = cursor;
  }

  toArray(): Promise<Transformed[]> {
    return this.cursor
      .toArray()
      .then((results: Model[]) =>
        results.map((result) =>
          this.resource.transform(result, this.connectedUser),
        ),
      );
  }
}
