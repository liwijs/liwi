<h1 align="center">
  liwi-resources-http-server
</h1>

<p align="center">
  liwi resources server implementation for http
</p>

<p align="center">
  <a href="https://npmjs.org/package/liwi-resources-http-server"><img src="https://img.shields.io/npm/v/liwi-resources-http-server.svg?style=flat-square" alt="npm version"></a>
  <a href="https://npmjs.org/package/liwi-resources-http-server"><img src="https://img.shields.io/npm/dw/liwi-resources-http-server.svg?style=flat-square" alt="npm downloads"></a>
  <a href="https://npmjs.org/package/liwi-resources-http-server"><img src="https://img.shields.io/node/v/liwi-resources-http-server.svg?style=flat-square" alt="node version"></a>
  <a href="https://npmjs.org/package/liwi-resources-http-server"><img src="https://img.shields.io/npm/types/liwi-resources-http-server.svg?style=flat-square" alt="types"></a>
</p>

## About

Exposes the `fetch` queries and `do` operations of a [`ResourcesServerService`](../liwi-resources-server) over plain HTTP, for [`liwi-resources-http-client`](../liwi-resources-http-client). Each request is stateless: it is authenticated on its own and gets its own message handler.

Subscriptions are not supported: use [`liwi-resources-websocket-server`](../liwi-resources-websocket-server) for live queries. Both servers can run side by side over the same `ResourcesServerService`.

## Install

```bash
npm install --save liwi-resources-http-server
```

## Usage

```ts
import http from "node:http";
import { createHttpRequestHandler } from "liwi-resources-http-server";
import { resourcesServerService } from "./resources/index.ts";

const handleResourcesRequest = createHttpRequestHandler({
  resourcesServerService,
  getAuthenticatedUser: (request) => getUserFromCookies(request), // sync, async, or null
});

const server = http.createServer((request, response) => {
  if (request.url === "/resources") {
    handleResourcesRequest(request, response);
    return;
  }
  app(request, response);
});
```

With express, mount it without a body parser in front: the handler reads the body stream itself.

```ts
app.post("/resources", handleResourcesRequest);
```

## API

### `createHttpRequestHandler({ resourcesServerService, getAuthenticatedUser, maxBodySize })`

- `resourcesServerService` — the registered resources.
- `getAuthenticatedUser(request)` — returns the user (or a promise, or `null`) for the request; it is passed to every query and operation as `loggedInUser`. Called on every request. If it throws, the request proceeds with `null`.
- `maxBodySize` — largest accepted request body, in bytes. Defaults to 1 MiB.

Returns a `(request, response) => void` node request listener. It does not route: every request it receives is handled.

## Behaviour

- Requests are `POST` with `Content-Type: application/json` and an `extended-json`-encoded `[type, payload]` body, `type` being `"fetch"` or `"do"`.
- Responses are `extended-json`-encoded `[error, result]` tuples with `Cache-Control: no-store`.

| Status | Error code               | Cause                                                        |
| ------ | ------------------------ | ------------------------------------------------------------ |
| 200    | —                        | success, `error` is `null`                                   |
| 400    | `INVALID_MESSAGE`        | body is not a `["fetch" \| "do", payload]` tuple             |
| 400    | `ResourcesServerError`'s | the query or operation threw a `ResourcesServerError`        |
| 405    | `METHOD_NOT_ALLOWED`     | method is not `POST`                                         |
| 413    | `PAYLOAD_TOO_LARGE`      | body exceeds `maxBodySize`; the connection is closed         |
| 415    | `UNSUPPORTED_MEDIA_TYPE` | `Content-Type` is not `application/json`                     |
| 500    | `INTERNAL_SERVER_ERROR`  | any other error; it is logged and its details are never sent |

- Requiring `application/json` makes every cross-origin call a CORS preflighted request, so a third-party page cannot trigger operations with the user's cookies. Configure CORS (or don't) in front of the handler as usual.
- Logging goes through `nightingale-logger` under `liwi:resources-http-server`.
