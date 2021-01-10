import type { TransportClient, ConnectionStates } from 'liwi-resources-client';
import type { ReactElement, ReactChild } from 'react';
import React from 'react';
export declare const TransportClientContext: React.Context<TransportClient>;
export declare const TransportClientStateContext: React.Context<ConnectionStates>;
export declare const TransportClientReadyContext: React.Context<boolean>;
declare type TransportClientProviderProps<P extends Record<never, unknown>> = {
    createFn: (params: Omit<P, 'createFn' | 'children'>) => TransportClient;
    children: ReactChild;
} & P;
export declare function TransportClientProvider<P extends Record<never, unknown>>({ createFn, children, ...params }: TransportClientProviderProps<P>): ReactElement;
export {};
//# sourceMappingURL=TransportClientProvider.d.ts.map