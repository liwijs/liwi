import { AbstractStoreCursor } from 'liwi-store';
import { BaseModel } from 'liwi-types';
import CursorResource from './CursorResource';

export default class ResourceServerCursor<
  Model extends BaseModel,
  Transformed = any,
  ConnectedUser = any
> {
  private readonly resource: CursorResource<Model, Transformed, ConnectedUser>;

  private readonly connectedUser?: ConnectedUser;

  private readonly cursor: AbstractStoreCursor<Model, any, any>;

  constructor(
    resource: CursorResource<Model, Transformed, ConnectedUser>,
    cursor: AbstractStoreCursor<Model, any, any, Model>,
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
