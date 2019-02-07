import { BaseModel, Criteria, QueryOptions, Sort } from 'liwi-types';
import { Store } from 'liwi-store';
import { OperationDescriptions } from 'liwi-resources';
export default interface Resource<Model extends BaseModel, QueryKeys extends string, Operations extends OperationDescriptions, Transformed = any, ConnectedUser = any> {
    store: Store<Model, any, any, any, any>;
    queries: Record<QueryKeys, QueryOptions<Model>>;
    operations: {
        [P in keyof Operations]: (params: Operations[P]['params'], connectedUser: undefined | ConnectedUser) => Promise<Operations[P]['result']>;
    };
    criteria(connectedUser: undefined | ConnectedUser, criteria: Criteria<Model>): Criteria<Model>;
    sort(connectedUser: undefined | ConnectedUser, sort: undefined | Sort<Model>): undefined | Sort<Model>;
    limit(limit: undefined | number): undefined | number;
    transform(result: Model, connectedUser: undefined | ConnectedUser): Transformed;
}
//# sourceMappingURL=Resource.d.ts.map