import type { ServiceInterface, Query, QueryParams } from 'liwi-resources';
import type { TransportClient } from './TransportClient';
export { ResourcesServerError } from 'liwi-resources';
export type { AckError, ToClientMessage, ToServerMessages, ToServerSubscribeMessages, ToServerQueryPayload, ToServerSubscribeQueryPayload, QuerySubscription, Query, QueryParams, QueryResult, QueryMeta, SubscribeCallback, } from 'liwi-resources';
export type { default as ClientQuery } from './ClientQuery';
export type { TransportClient, TransportClientSubscribeCallback, TransportClientSubscribeResult, ConnectionStateChangeListener, ConnectionStateChangeListenerCreator, ConnectionStates, } from './TransportClient';
interface CreateResourceClientOptions<QueryKeys extends keyof any, OperationKeys extends keyof any> {
    queries: Record<QueryKeys, null>;
    operations: Record<OperationKeys, null>;
}
export declare type ServiceQuery<Result, Params extends QueryParams<Params>> = (params: Params) => Query<Result, Params>;
export interface ClientServiceInterface<QueryKeys extends keyof any, OperationKeys extends keyof any> extends ServiceInterface<QueryKeys, OperationKeys> {
    queries: {
        [key in QueryKeys]: ServiceQuery<any, any>;
    };
    operations: {
        [key in OperationKeys]: (params: any) => Promise<any>;
    };
}
export declare const createResourceClientService: <Service extends ClientServiceInterface<keyof Service["queries"], keyof Service["operations"]>>(resourceName: string, options: CreateResourceClientOptions<keyof Service["queries"], keyof Service["operations"]>) => (transportClient: TransportClient) => Service;
//# sourceMappingURL=index.d.ts.map