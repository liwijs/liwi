import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix';
import type { MetaFunction } from 'remix';
import { createVoidTransportClient } from 'liwi-resources-void-client';
import type { WebsocketTransportClientOptions } from 'liwi-resources-websocket-client';
import { createWebsocketTransportClient } from 'liwi-resources-websocket-client';
import { ConnectionState } from 'react-alp-connection-state';
import {
  TransportClientProvider,
  transportClientStateToSimplifiedState,
  useTransportClientState,
} from 'react-liwi';
import { TodoServicesProvider } from './services/TodoServicesProvider';
import { ReactElement } from 'react';
import sharedStyles from './shared.css';
import { LinksFunction } from '@remix-run/react/routeModules';
import { useReactNativeStyles } from './rn-styles';

function AppConnectionState(): ReactElement {
  const transportClientState = useTransportClientState();
  const state = transportClientStateToSimplifiedState(transportClientState);
  return <ConnectionState state={state}>{state}</ConnectionState>;
}

export const meta: MetaFunction = () => {
  return { title: 'TODO Example Remix App with liwi' };
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: sharedStyles }];
};

export default function App() {
  const stylesElement = useReactNativeStyles();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {stylesElement}
      </head>
      <body>
        <TransportClientProvider<WebsocketTransportClientOptions>
          url="ws://localhost:4005/ws"
          createFn={
            typeof window === 'undefined'
              ? createVoidTransportClient
              : createWebsocketTransportClient
          }
          onError={console.error}
        >
          <AppConnectionState />
          <TodoServicesProvider>
            <Outlet />
          </TodoServicesProvider>
        </TransportClientProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
