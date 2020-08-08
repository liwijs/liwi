import {
  createWebsocketTransportClient,
  WebsocketTransportClientOptions,
} from 'liwi-resources-websocket-client';
import React, { ReactElement } from 'react';
import { TransportClientProvider } from 'react-liwi';
import App from './core/Layout';

export default function BrowserApp(): ReactElement {
  return (
    <TransportClientProvider<WebsocketTransportClientOptions>
      createFn={createWebsocketTransportClient}
      onError={console.error}
    >
      <App />
    </TransportClientProvider>
  );
}
