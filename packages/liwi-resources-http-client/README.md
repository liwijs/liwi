<h1 align="center">
  liwi-resources-http-client
</h1>

<p align="center">
  http client implementation for liwi
</p>

<p align="center">
  <a href="https://npmjs.org/package/liwi-resources-http-client"><img src="https://img.shields.io/npm/v/liwi-resources-http-client.svg?style=flat-square" alt="npm version"></a>
  <a href="https://npmjs.org/package/liwi-resources-http-client"><img src="https://img.shields.io/npm/dw/liwi-resources-http-client.svg?style=flat-square" alt="npm downloads"></a>
  <a href="https://npmjs.org/package/liwi-resources-http-client"><img src="https://img.shields.io/node/v/liwi-resources-http-client.svg?style=flat-square" alt="node version"></a>
  <a href="https://npmjs.org/package/liwi-resources-http-client"><img src="https://img.shields.io/npm/types/liwi-resources-http-client.svg?style=flat-square" alt="types"></a>
</p>

## About

[`TransportClient`](../liwi-resources-client#transportclient) over `fetch`, to be used against [`liwi-resources-http-server`](../liwi-resources-http-server). Works in browsers and node.

Each `fetch` query and `do` operation is one stateless `POST`, so it fits SSR, scripts, serverless hosts and networks that block websockets, and headers are evaluated per request.

Subscriptions are not supported: `subscribe` throws. Use [`liwi-resources-websocket-client`](../liwi-resources-websocket-client) for live queries.

## Install

```bash
npm install --save liwi-resources-http-client
```

## Usage

```ts
import { createHttpTransportClient } from "liwi-resources-http-client";

const transportClient = createHttpTransportClient({
  url: "https://api.example.com/resources",
  headers: () => ({ authorization: `Bearer ${getToken()}` }),
});

const tasksService = createTasksServiceClient(transportClient);
const tasks = await tasksService.queries
  .queryAll({ limit: 20, page: 1 })
  .fetch();
```

With `react-liwi`, use it as the `createFn` of `TransportClientProvider`, and do not pass `subscribe: true` to hooks.

## Options

| Option        | Default        | Description                                                                       |
| ------------- | -------------- | --------------------------------------------------------------------------------- |
| `url`         | — (required)   | Endpoint served by `liwi-resources-http-server`. May be relative in a browser     |
| `headers`     | —              | Request headers, or a function returning them (sync or async)                     |
| `credentials` | fetch default  | `RequestCredentials` passed to `fetch`, e.g. `"include"` for cross-origin cookies |
| `fetch`       | global `fetch` | `fetch` implementation to use                                                     |

Pass `headers` as a **function** when the token can expire: it is evaluated before every request.

## Behaviour

- `connect()` moves the state to `connected` and `close()` to `closed`; there is no connection, the state only exists so `react-liwi` reports the client as ready. `send` works in any state.
- `close()` aborts in-flight requests: their promises reject with an `AbortError`.
- An error returned by the server rejects with a `ResourcesServerError` carrying its `code`.
- A response that is not a protocol tuple (a proxy's 502 page, a 401 from an auth middleware in front) rejects with an `HttpTransportError` carrying the HTTP `status`; test it with `isHttpTransportError(error)`.
- Network failures reject with `fetch`'s own error.
