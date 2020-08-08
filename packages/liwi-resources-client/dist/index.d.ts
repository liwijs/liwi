import type { ServiceInterface as ClientServiceInterface } from 'liwi-resources';
import type { TransportClient } from './TransportClient';
export { ResourcesServerError } from 'liwi-resources';
export type { AckError, ToClientMessage, ToServerMessages, ToServerSubscribeMessages, ToServerQueryPayload, ToServerSubscribeQueryPayload, QuerySubscription, Query, QueryParams, QueryResult, QueryMeta, SubscribeCallback, ServiceQuery, } from 'liwi-resources';
export type { default as ClientQuery } from './ClientQuery';
export type { TransportClient, TransportClientSubscribeCallback, TransportClientSubscribeResult, ConnectionStateChangeListener, ConnectionStateChangeListenerCreator, ConnectionStates, } from './TransportClient';
interface CreateResourceClientOptions<QueryKeys extends keyof any, OperationKeys extends keyof any> {
    queries: Record<QueryKeys, null>;
    operations: Record<OperationKeys, null>;
}
export type { ClientServiceInterface };
export declare const createResourceClientService: <Service extends ClientServiceInterface<Service["queries"], Service["operations"]>>(resourceName: string, options: CreateResourceClientOptions<keyof Service["queries"], keyof Service["operations"]>) => (transportClient: TransportClient) => Service;
//# sourceMappingURL=index.d.ts.map