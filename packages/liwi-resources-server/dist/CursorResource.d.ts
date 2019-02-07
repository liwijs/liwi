import { BaseModel, Criteria, Sort } from 'liwi-types';
import { Store } from 'liwi-store';
export default interface Resource<Model extends BaseModel, Transformed = any, ConnectedUser = any> {
    store: Store<Model, any, any, any, any>;
    criteria(connectedUser: undefined | ConnectedUser, criteria: Criteria<Model>): Criteria<Model>;
    sort(connectedUser: undefined | ConnectedUser, sort: undefined | Sort<Model>): undefined | Sort<Model>;
    limit(limit: undefined | number): undefined | number;
    transform(result: Model, connectedUser: undefined | ConnectedUser): Transformed;
}
//# sourceMappingURL=CursorResource.d.ts.map