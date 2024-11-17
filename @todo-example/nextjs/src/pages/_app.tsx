import "../styles/globals.css";
import { createVoidTransportClient } from "liwi-resources-void-client";
import type { WebsocketTransportClientOptions } from "liwi-resources-websocket-client";
import { createWebsocketTransportClient } from "liwi-resources-websocket-client";
import type { AppProps } from "next/app";
import { appLogger } from "nightingale-app-console";
import type { ReactNode } from "react";
import { ConnectionState } from "react-alp-connection-state";
import {
  TransportClientProvider,
  transportClientStateToSimplifiedState,
  useTransportClientState,
} from "react-liwi";
import { TodoServicesProvider } from "../app/services/TodoServicesProvider";

appLogger.debug("Loading _app.tsx");

function AppConnectionState(): ReactNode {
  const transportClientState = useTransportClientState();
  const state = transportClientStateToSimplifiedState(transportClientState);
  return <ConnectionState state={state}>{state}</ConnectionState>;
}

export default function App({ Component, pageProps }: AppProps): ReactNode {
  return (
    <TransportClientProvider<WebsocketTransportClientOptions>
      url="ws://localhost:4005/ws"
      createFn={
        typeof window === "undefined"
          ? createVoidTransportClient
          : createWebsocketTransportClient
      }
      onError={console.error}
    >
      <AppConnectionState />
      <TodoServicesProvider>
        <Component {...pageProps} />
      </TodoServicesProvider>
    </TransportClientProvider>
  );
}
