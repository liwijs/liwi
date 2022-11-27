import type { ConnectionStates } from 'liwi-resources-client/src/TransportClient';
export { useResource } from './useResource';
export type { PaginatedQueryRequiredParams, Pagination, } from './usePaginatedResource';
export { usePaginatedResource } from './usePaginatedResource';
export { useOperation } from './useOperation';
export type { OperationCallWrapper } from './useOperation';
export type { ResourceResult } from './createResourceResultFromState';
export { TransportClientProvider, TransportClientContext, TransportClientStateContext, TransportClientReadyContext, useTransportClientState, useTransportClientIsReady, } from './TransportClientProvider';
export { ResourcesServerError } from 'liwi-resources-client';
export type SimplifiedConnectionState = 'connecting' | 'connected' | 'disconnected';
export declare const transportClientStateToSimplifiedState: (state: ConnectionStates) => SimplifiedConnectionState;
//# sourceMappingURL=index.d.ts.map