import { BaseModel, Criteria, QueryOptions, Sort } from 'liwi-types';
import { Store } from 'liwi-store';
import { OperationDescriptions } from 'liwi-resources';
export default interface Resource<Model extends BaseModel, QueryKeys extends string, Operations extends OperationDescriptions, Transformed = any, ConnectedUser = any> {
    store: Store<Model, any, any, any, any>;
    queries: Record<QueryKeys, QueryOptions<Model>>;
    operations: {
        [P in keyof Operations]: (params: Operations[P]['params']) => Promise<Operations[P]['result']>;
    };
    criteria(connectedUser: ConnectedUser, criteria: Criteria<Model>): Criteria<Model>;
    sort(connectedUser: ConnectedUser, sort: undefined | Sort<Model>): undefined | Sort<Model>;
    limit(limit: undefined | number): undefined | number;
    transform(result: Model, connectedUser: ConnectedUser): Transformed;
}
//# sourceMappingURL=Resource.d.ts.map