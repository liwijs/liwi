import type { TransportClient, ConnectionStates } from 'liwi-resources-client';
import type { ReactElement, ReactNode } from 'react';
export declare const TransportClientContext: import("react").Context<TransportClient>;
export declare const TransportClientStateContext: import("react").Context<ConnectionStates>;
export declare const TransportClientReadyContext: import("react").Context<boolean>;
export declare const useTransportClientState: () => ConnectionStates;
export declare const useTransportClientIsReady: () => boolean;
type TransportClientProviderProps<P extends Record<never, unknown>> = {
    createFn: (params: Omit<P, 'createFn' | 'children'>) => TransportClient;
    children: ReactNode;
} & P;
export declare function TransportClientProvider<P extends Record<never, unknown>>({ createFn, children, ...params }: TransportClientProviderProps<P>): ReactElement;
export {};
//# sourceMappingURL=TransportClientProvider.d.ts.map