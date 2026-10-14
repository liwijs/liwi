import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, describe, test } from "node:test";
import { decode, encode } from "extended-json";
import type {
  ResourcesServerService,
  ServiceResource,
  ToClientHttpResponse,
} from "liwi-resources-server";
import { ResourcesServerError } from "liwi-resources-server";
import { createHttpRequestHandler } from "./createHttpRequestHandler.ts";

interface User {
  id: string;
}

const createdAt = new Date("2026-10-14T10:00:00.000Z");

const resource = {
  queries: {
    queryAll: (params: unknown, user: User | null) => ({
      fetch: (onFulfilled: (result: unknown) => unknown) =>
        Promise.resolve(onFulfilled({ params, user, createdAt })),
    }),
  },
  operations: {
    echo: (params: unknown, user: User | null) =>
      Promise.resolve({ params, user }),
    forbidden: () => {
      throw new ResourcesServerError("FORBIDDEN", "Not allowed");
    },
    crash: () => {
      throw new Error("database password is hunter2");
    },
  },
} as unknown as ServiceResource<any, any>;

const resourcesServerService = {
  getServiceResource: (name: string) => {
    if (name !== "posts") throw new Error(`Invalid service resource: ${name}`);
    return resource;
  },
} as unknown as ResourcesServerService;

describe("createHttpRequestHandler", () => {
  const handler = createHttpRequestHandler<User>({
    resourcesServerService,
    maxBodySize: 1024,
    getAuthenticatedUser: (request) => {
      if (request.headers.authorization === "throw") throw new Error("boom");
      return request.headers.authorization
        ? { id: request.headers.authorization }
        : null;
    },
  });
  const httpServer = createServer(handler);
  let url: string;

  before(async () => {
    await new Promise<void>((resolve) => {
      httpServer.listen(0, "127.0.0.1", resolve);
    });
    const { port } = httpServer.address() as AddressInfo;
    url = `http://127.0.0.1:${port}/resources`;
  });

  after(async () => {
    await new Promise<void>((resolve, reject) => {
      httpServer.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  });

  const post = async (
    body: string,
    headers: Record<string, string> = {},
  ): Promise<{ status: number; body: ToClientHttpResponse<any> }> => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body,
    });
    return { status: response.status, body: decode(await response.text()) };
  };

  test("fetch runs the query and keeps dates", async () => {
    const response = await post(
      encode([
        "fetch",
        { resourceName: "posts", key: "queryAll", params: { limit: 2 } },
      ]),
      { authorization: "user-1" },
    );

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, [
      null,
      { params: { limit: 2 }, user: { id: "user-1" }, createdAt },
    ]);
  });

  test("do runs the operation with the authenticated user", async () => {
    const response = await post(
      encode([
        "do",
        { resourceName: "posts", operationKey: "echo", params: { a: 1 } },
      ]),
      { authorization: "user-2" },
    );

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, [
      null,
      { params: { a: 1 }, user: { id: "user-2" } },
    ]);
  });

  test("a throwing getAuthenticatedUser proceeds with null", async () => {
    const response = await post(
      encode([
        "do",
        { resourceName: "posts", operationKey: "echo", params: {} },
      ]),
      { authorization: "throw" },
    );

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, [null, { params: {}, user: null }]);
  });

  test("ResourcesServerError is forwarded as 400 with its code", async () => {
    const response = await post(
      encode([
        "do",
        { resourceName: "posts", operationKey: "forbidden", params: {} },
      ]),
    );

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, [
      { code: "FORBIDDEN", message: "Not allowed" },
      null,
    ]);
  });

  test("unexpected errors are hidden behind a 500", async () => {
    const response = await post(
      encode([
        "do",
        { resourceName: "posts", operationKey: "crash", params: {} },
      ]),
    );

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, [
      { code: "INTERNAL_SERVER_ERROR", message: "Internal Server Error" },
      null,
    ]);
  });

  test("subscriptions are rejected as invalid messages", async () => {
    const response = await post(
      encode([
        "subscribe",
        {
          resourceName: "posts",
          key: "queryAll",
          params: {},
          subscriptionId: 1,
        },
      ]),
    );

    assert.equal(response.status, 400);
    assert.equal(response.body[0]?.code, "INVALID_MESSAGE");
  });

  test("malformed json is rejected as invalid message", async () => {
    const response = await post("[not json");

    assert.equal(response.status, 400);
    assert.equal(response.body[0]?.code, "INVALID_MESSAGE");
  });

  test("non-POST methods get 405", async () => {
    const response = await fetch(url);

    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "POST");
  });

  test("non-json content types get 415", async () => {
    const response = await post(
      encode([
        "do",
        { resourceName: "posts", operationKey: "echo", params: {} },
      ]),
      { "content-type": "text/plain" },
    );

    assert.equal(response.status, 415);
    assert.equal(response.body[0]?.code, "UNSUPPORTED_MEDIA_TYPE");
  });

  test("bodies above maxBodySize get 413", async () => {
    const response = await post(
      encode([
        "do",
        {
          resourceName: "posts",
          operationKey: "echo",
          params: { a: "x".repeat(2048) },
        },
      ]),
    );

    assert.equal(response.status, 413);
    assert.equal(response.body[0]?.code, "PAYLOAD_TOO_LARGE");
  });
});
