import type { TransportClient, ConnectionStates } from 'liwi-resources-client';
import type { ReactElement, ReactChild } from 'react';
import React, { createContext, useState, useEffect } from 'react';

export const TransportClientContext = createContext<TransportClient>(
  undefined as any,
);

export const TransportClientStateContext = createContext<ConnectionStates>(
  'opening',
);
export const TransportClientReadyContext = createContext<boolean>(false);

type TransportClientProviderProps<P extends Record<never, unknown>> = {
  createFn: (params: Omit<P, 'createFn' | 'children'>) => TransportClient;
  children: ReactChild;
} & P;

export function TransportClientProvider<P extends Record<never, unknown>>({
  createFn,
  children,
  ...params
}: TransportClientProviderProps<P>): ReactElement {
  const [client] = useState(() => {
    return createFn(params);
  });
  const [connectionState, setConnectionState] = useState<ConnectionStates>(
    'opening',
  );

  useEffect(() => {
    const closeConnectionStateListener = client.listenStateChange(
      setConnectionState,
    );
    client.connect();

    return (): void => {
      closeConnectionStateListener();
      client.close();
    };
  }, [client]);

  return (
    <TransportClientContext.Provider value={client}>
      <TransportClientStateContext.Provider value={connectionState}>
        <TransportClientReadyContext.Provider
          value={connectionState === 'connected'}
        >
          {children}
        </TransportClientReadyContext.Provider>
      </TransportClientStateContext.Provider>
    </TransportClientContext.Provider>
  );
}
