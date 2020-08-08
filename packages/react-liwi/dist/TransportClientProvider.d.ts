import { TransportClient, ConnectionStates } from 'liwi-resources-client';
import React, { ReactElement, ReactChild } from 'react';
export declare const TransportClientContext: React.Context<TransportClient>;
export declare const TransportClientStateContext: React.Context<ConnectionStates>;
export declare const TransportClientReadyContext: React.Context<boolean>;
declare type TransportClientProviderProps<P extends {}> = {
    createFn: (params: Omit<P, 'createFn' | 'children'>) => TransportClient;
    children: ReactChild;
} & P;
export declare function TransportClientProvider<P extends {}>({ createFn, children, ...params }: TransportClientProviderProps<P>): ReactElement;
export {};
//# sourceMappingURL=TransportClientProvider.d.ts.map