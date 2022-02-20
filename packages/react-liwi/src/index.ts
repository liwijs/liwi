import type { ConnectionStates } from 'liwi-resources-client/src/TransportClient';

export { useResource } from './useResource';
export { usePaginatedResource } from './usePaginatedResource';
export { useOperation } from './useOperation';
export type { OperationCallWrapper } from './useOperation';
export type { ResourceResult } from './createResourceResultFromState';
export {
  TransportClientProvider,
  TransportClientContext,
  TransportClientStateContext,
  TransportClientReadyContext,
  useTransportClientState,
  useTransportClientIsReady,
} from './TransportClientProvider';
export { ResourcesServerError } from 'liwi-resources-client';

export type SimplifiedConnectionState =
  | 'connecting'
  | 'connected'
  | 'disconnected';

// eslint-disable-next-line complexity
export const transportClientStateToSimplifiedState = (
  state: ConnectionStates,
): SimplifiedConnectionState => {
  switch (state) {
    case 'opening':
    case 'connecting':
    case 'reconnect-scheduled':
    case 'wait-for-visibility':
      return 'connecting';

    case 'connected':
      return 'connected';

    case 'closed':
      return 'disconnected';
  }
};
