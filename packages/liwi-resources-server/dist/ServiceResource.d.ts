import { AbstractQuery } from 'liwi-store';
import { QueryDescriptions, OperationDescriptions } from 'liwi-resources';
export default interface ServiceResource<Queries extends QueryDescriptions, Operations extends OperationDescriptions, ConnectedUser = any> {
    queries: {
        [P in keyof Queries]: (params: Queries[P]['params'], connectedUser: undefined | ConnectedUser) => AbstractQuery<Queries[P]['model']>;
    };
    operations: {
        [P in keyof Operations]: (params: Operations[P]['params'], connectedUser: undefined | ConnectedUser) => Promise<Operations[P]['result']>;
    };
}
//# sourceMappingURL=ServiceResource.d.ts.map