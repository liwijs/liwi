import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { decode, encode } from "extended-json";
import { ResourcesServerError } from "liwi-resources-client";
import type { ConnectionStates } from "liwi-resources-client";
import {
  HttpTransportError,
  createHttpTransportClient,
} from "./createHttpTransportClient.ts";

interface RecordedRequest {
  url: string;
  init: RequestInit;
}

const createFakeFetch = (
  createResponse: () => Response,
): { fetch: typeof globalThis.fetch; requests: RecordedRequest[] } => {
  const requests: RecordedRequest[] = [];
  const fetch: typeof globalThis.fetch = (input, init = {}) => {
    requests.push({ url: input as string, init });
    return Promise.resolve(createResponse());
  };
  return { fetch, requests };
};

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(encode(body as never), { status });

describe("createHttpTransportClient", () => {
  test("send posts the encoded message and resolves the result", async () => {
    const createdAt = new Date("2026-10-14T10:00:00.000Z");
    const { fetch, requests } = createFakeFetch(() =>
      jsonResponse([null, { createdAt }]),
    );
    const client = createHttpTransportClient({ url: "/resources", fetch });

    const result = await client.send("fetch", {
      resourceName: "posts",
      key: "queryAll",
      params: { limit: 2 },
    });

    assert.deepEqual(result, { createdAt });
    assert.equal(requests.length, 1);
    assert.equal(requests[0]!.url, "/resources");
    assert.equal(requests[0]!.init.method, "POST");
    assert.deepEqual(decode(requests[0]!.init.body as string), [
      "fetch",
      { resourceName: "posts", key: "queryAll", params: { limit: 2 } },
    ]);
    assert.equal(
      new Headers(requests[0]!.init.headers).get("content-type"),
      "application/json",
    );
  });

  test("headers function is evaluated on every request", async () => {
    const { fetch, requests } = createFakeFetch(() =>
      jsonResponse([null, null]),
    );
    let token = 0;
    const client = createHttpTransportClient({
      url: "/resources",
      fetch,
      headers: () => ({ authorization: `Bearer ${++token}` }),
    });
    const payload = {
      resourceName: "posts",
      operationKey: "create",
      params: {},
    };

    await client.send("do", payload);
    await client.send("do", payload);

    assert.deepEqual(
      requests.map(({ init }) =>
        new Headers(init.headers).get("authorization"),
      ),
      ["Bearer 1", "Bearer 2"],
    );
  });

  test("an error tuple rejects with ResourcesServerError", async () => {
    const { fetch } = createFakeFetch(() =>
      jsonResponse([{ code: "FORBIDDEN", message: "Not allowed" }, null], 400),
    );
    const client = createHttpTransportClient({ url: "/resources", fetch });

    await assert.rejects(
      client.send("do", {
        resourceName: "posts",
        operationKey: "x",
        params: {},
      }),
      (error: unknown) =>
        error instanceof ResourcesServerError &&
        error.code === "FORBIDDEN" &&
        error.message === "Not allowed",
    );
  });

  test("a non-protocol response rejects with HttpTransportError", async () => {
    const { fetch } = createFakeFetch(
      () => new Response("<html>Bad Gateway</html>", { status: 502 }),
    );
    const client = createHttpTransportClient({ url: "/resources", fetch });

    await assert.rejects(
      client.send("do", {
        resourceName: "posts",
        operationKey: "x",
        params: {},
      }),
      (error: unknown) =>
        error instanceof HttpTransportError && error.status === 502,
    );
  });

  test("connect and close drive the connection state", () => {
    const { fetch } = createFakeFetch(() => jsonResponse([null, null]));
    const client = createHttpTransportClient({ url: "/resources", fetch });
    const states: ConnectionStates[] = [];
    const unlisten = client.listenStateChange((state) => states.push(state));

    client.connect();
    client.close();
    unlisten();
    client.connect();

    assert.deepEqual(states, ["connected", "closed"]);
  });

  test("close aborts in-flight requests", async () => {
    const signals: AbortSignal[] = [];
    const fetch: typeof globalThis.fetch = (input, init) =>
      new Promise((resolve, reject) => {
        signals.push(init!.signal!);
        init!.signal!.addEventListener("abort", () => {
          reject(init!.signal!.reason as Error);
        });
      });
    const client = createHttpTransportClient({ url: "/resources", fetch });

    const pending = client.send("do", {
      resourceName: "posts",
      operationKey: "x",
      params: {},
    });
    await Promise.resolve();
    client.close();

    await assert.rejects(pending, { name: "AbortError" });
    assert.equal(signals[0]!.aborted, true);
  });

  test("subscribe is not supported", () => {
    const { fetch } = createFakeFetch(() => jsonResponse([null, null]));
    const client = createHttpTransportClient({ url: "/resources", fetch });

    assert.throws(
      () =>
        client.subscribe(
          "subscribe",
          { resourceName: "posts", key: "queryAll", params: {} },
          () => {},
        ),
      /does not support subscriptions/,
    );
  });
});
