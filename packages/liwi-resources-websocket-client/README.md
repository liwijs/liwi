<h3 align="center">
  liwi-resources-websocket-client
</h3>

<p align="center">
  websocket client implementation for liwi
</p>

<p align="center">
  <a href="https://npmjs.org/package/liwi-resources-websocket-client"><img src="https://img.shields.io/npm/v/liwi-resources-websocket-client.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/liwi-resources-websocket-client"><img src="https://img.shields.io/npm/dw/liwi-resources-websocket-client.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/liwi-resources-websocket-client"><img src="https://img.shields.io/node/v/liwi-resources-websocket-client.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/liwi-resources-websocket-client"><img src="https://img.shields.io/npm/types/liwi-resources-websocket-client.svg?style=flat-square"></a>
</p>

## Install

```bash
npm install --save liwi-resources-websocket-client
```

## Usage

```tsx
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
```
