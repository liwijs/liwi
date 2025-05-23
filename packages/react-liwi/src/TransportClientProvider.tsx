import type { ConnectionStates, TransportClient } from "liwi-resources-client";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

export const TransportClientContext = createContext<TransportClient>(
  undefined as unknown as TransportClient,
);

export const TransportClientStateContext =
  createContext<ConnectionStates>("opening");
export const TransportClientReadyContext = createContext<boolean>(false);

export const useTransportClientState = (): ConnectionStates =>
  useContext(TransportClientStateContext);
export const useTransportClientIsReady = (): boolean =>
  useContext(TransportClientReadyContext);

type TransportClientProviderProps<P extends Record<never, unknown>> = P & {
  createFn: (params: Omit<P, "children" | "createFn">) => TransportClient;
  children: ReactNode;
};

export function TransportClientProvider<P extends Record<never, unknown>>({
  createFn,
  children,
  ...params
}: TransportClientProviderProps<P>): ReactNode {
  // eslint-disable-next-line react/hook-use-state
  const [client] = useState(() => {
    return createFn(params);
  });
  const [connectionState, setConnectionState] =
    useState<ConnectionStates>("opening");

  useEffect(() => {
    const closeConnectionStateListener =
      client.listenStateChange(setConnectionState);
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
          value={connectionState === "connected"}
        >
          {children}
        </TransportClientReadyContext.Provider>
      </TransportClientStateContext.Provider>
    </TransportClientContext.Provider>
  );
}
