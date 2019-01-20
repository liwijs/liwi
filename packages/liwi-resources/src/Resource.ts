import { BaseModel, Criteria, QueryOptions, Sort } from 'liwi-types';
import { Store } from 'liwi-store';

export default interface Resource<
  Model extends BaseModel,
  Transformed = any,
  ConnectedUser = any
> {
  store: Store<Model, any, any, any, any>;

  queries: { [key: string]: QueryOptions<Model> };

  criteria(
    connectedUser: ConnectedUser,
    criteria: Criteria<Model>,
  ): Criteria<Model>;

  sort(
    connectedUser: ConnectedUser,
    sort: undefined | Sort<Model>,
  ): undefined | Sort<Model>;

  limit(limit: undefined | number): undefined | number;

  transform(result: Model, connectedUser: ConnectedUser): Transformed;
}
