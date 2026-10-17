import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { decode, encode } from "extended-json";
import createWebsocketTransportClient from "./createWebsocketTransportClient.ts";
import { createFakeWebSocket } from "./test-utils/createFakeWebSocket.ts";

const fetchPayload = {
  resourceName: "todos",
  key: "todos",
  params: undefined,
};

const withLocation = (
  location: { host: string; protocol: string } | undefined,
  run: () => void,
): void => {
  const globalWithLocation = globalThis as { location?: unknown };
  const previousLocation = globalWithLocation.location;
  if (location) globalWithLocation.location = location;
  else delete globalWithLocation.location;

  try {
    run();
  } finally {
    if (previousLocation === undefined) delete globalWithLocation.location;
    else globalWithLocation.location = previousLocation;
  }
};

describe("createWebsocketTransportClient", () => {
  test("returns a working client on a node host", async () => {
    assert.equal(
      (globalThis as { window?: unknown }).window,
      undefined,
      "this test asserts the absence of the removed SSR stub, it needs a node host",
    );

    const { WebSocketImplementation, instances, lastInstance } =
      createFakeWebSocket();

    const client = createWebsocketTransportClient({
      url: "ws://localhost:3000/ws",
      webSocketImplementation: WebSocketImplementation,
      visibilitySource: false,
    });

    client.connect();
    assert.equal(instances.length, 1);

    const socket = lastInstance();
    socket.emitOpen();
    socket.emitMessage("connection-ack");

    const sendPromise = client.send("fetch", fetchPayload);
    const sentMessage = socket.sentMessages.at(-1);
    assert.ok(sentMessage);
    const [type, id] = decode<[string, number, unknown]>(sentMessage);
    assert.equal(type, "fetch");

    socket.emitMessage(encode(["ack", id, null, [{ _id: "1" }]]));
    assert.deepEqual(await sendPromise, [{ _id: "1" }]);

    client.close();
  });

  test("throws when url is omitted and there is no location", () => {
    const { WebSocketImplementation } = createFakeWebSocket();

    withLocation(undefined, () => {
      assert.throws(
        () =>
          createWebsocketTransportClient({
            webSocketImplementation: WebSocketImplementation,
            visibilitySource: false,
          }),
        /`url` is required when globalThis.location is undefined/,
      );
    });
  });

  test("derives a secure url from location", () => {
    const { WebSocketImplementation, lastInstance } = createFakeWebSocket();

    withLocation({ protocol: "https:", host: "x.example" }, () => {
      const client = createWebsocketTransportClient({
        webSocketImplementation: WebSocketImplementation,
        visibilitySource: false,
      });
      client.connect();
      assert.equal(lastInstance().url, "wss://x.example/ws");
      client.close();
    });
  });

  test("derives an insecure url from a plain http location", () => {
    const { WebSocketImplementation, lastInstance } = createFakeWebSocket();

    withLocation({ protocol: "http:", host: "localhost:3000" }, () => {
      const client = createWebsocketTransportClient({
        webSocketImplementation: WebSocketImplementation,
        visibilitySource: false,
      });
      client.connect();
      assert.equal(lastInstance().url, "ws://localhost:3000/ws");
      client.close();
    });
  });

  test("an unrecoverable handshake failure rejects pending work", async () => {
    const { WebSocketImplementation, lastInstance } = createFakeWebSocket({
      withEmitter: true,
    });
    const failures: unknown[] = [];

    const client = createWebsocketTransportClient({
      url: "ws://localhost:3000/ws",
      webSocketImplementation: WebSocketImplementation,
      visibilitySource: false,
      onConnectionFailure: (failure) => failures.push(failure),
    });

    client.connect();
    const socket = lastInstance();
    socket.emitOpen();
    socket.emitMessage("connection-ack");

    const sendPromise = client.send("fetch", fetchPayload);
    const subscribePromise = client.subscribe(
      "fetchAndSubscribe",
      { resourceName: "todos", key: "todos", params: undefined },
      () => {},
    );

    socket.emitUnexpectedResponse({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
    socket.emitClose({ code: 1006 });

    await assert.rejects(sendPromise, /connection state is now/);
    await assert.rejects(
      Promise.resolve(subscribePromise),
      /Subscription closed/,
    );
    assert.deepEqual(failures, [
      {
        type: "handshake",
        status: 401,
        statusText: "Unauthorized",
        willReconnect: false,
      },
    ]);
  });
});

describe("createWebsocketTransportClient reconnection", () => {
  const subscribePayload = {
    resourceName: "todos",
    key: "queryAll",
    params: {},
  };

  type SentMessage = [string, number | null, Record<string, unknown>];

  const createConnectedClient = (): {
    client: ReturnType<typeof createWebsocketTransportClient>;
    lastInstance: ReturnType<typeof createFakeWebSocket>["lastInstance"];
    instances: ReturnType<typeof createFakeWebSocket>["instances"];
    connectLastSocket: () => void;
  } => {
    const { WebSocketImplementation, instances, lastInstance } =
      createFakeWebSocket();
    const client = createWebsocketTransportClient({
      url: "ws://localhost:3000/ws",
      webSocketImplementation: WebSocketImplementation,
      visibilitySource: false,
      reconnectionDelayMin: 1,
      reconnectionDelayMax: 1,
      onError: () => {},
    });
    const connectLastSocket = (): void => {
      lastInstance().emitOpen();
      lastInstance().emitMessage("connection-ack");
    };
    client.connect();
    connectLastSocket();
    return { client, lastInstance, instances, connectLastSocket };
  };

  const getSentMessages = (
    socket: ReturnType<ReturnType<typeof createFakeWebSocket>["lastInstance"]>,
  ): SentMessage[] =>
    socket.sentMessages.map((message) => decode<SentMessage>(message));

  const ackLastMessage = (
    socket: ReturnType<ReturnType<typeof createFakeWebSocket>["lastInstance"]>,
    error: { code: string; message: string } | null = null,
  ): void => {
    const [, id] = getSentMessages(socket).at(-1)!;
    socket.emitMessage(encode(["ack", id, error, null]));
  };

  const reconnect = async (
    lastInstance: () => ReturnType<
      ReturnType<typeof createFakeWebSocket>["lastInstance"]
    >,
    instances: unknown[],
    connectLastSocket: () => void,
  ): Promise<void> => {
    const instanceCount = instances.length;
    lastInstance().emitClose({ code: 1006 });
    await delay(20);
    assert.equal(instances.length, instanceCount + 1, "should reconnect");
    connectLastSocket();
  };

  test("re-sends a subscription after a reconnection", async () => {
    const { client, lastInstance, instances, connectLastSocket } =
      createConnectedClient();

    const subscription = client.subscribe(
      "fetchAndSubscribe",
      subscribePayload,
      () => {},
    );
    ackLastMessage(lastInstance());
    await subscription;

    await reconnect(lastInstance, instances, connectLastSocket);

    const [type, , payload] = getSentMessages(lastInstance()).at(-1)!;
    assert.equal(type, "fetchAndSubscribe");
    assert.equal(payload.key, "queryAll");

    client.close();
  });

  test("a first subscription cut by a disconnection resolves after the reconnection", async () => {
    const { client, lastInstance, instances, connectLastSocket } =
      createConnectedClient();
    let isRejected = false;

    const subscription = client.subscribe(
      "fetchAndSubscribe",
      subscribePayload,
      () => {},
    );
    subscription.then(undefined, () => {
      isRejected = true;
    });

    await reconnect(lastInstance, instances, connectLastSocket);
    assert.equal(isRejected, false);
    ackLastMessage(lastInstance());
    await subscription;

    client.close();
  });

  test("a re-subscription refused by the server reaches the callback", async () => {
    const { client, lastInstance, instances, connectLastSocket } =
      createConnectedClient();
    const errors: (Error | null)[] = [];

    const subscription = client.subscribe(
      "fetchAndSubscribe",
      subscribePayload,
      (error) => errors.push(error),
    );
    ackLastMessage(lastInstance());
    await subscription;

    await reconnect(lastInstance, instances, connectLastSocket);
    ackLastMessage(lastInstance(), { code: "FORBIDDEN", message: "refused" });
    await delay(0);

    assert.equal(errors.length, 1);
    assert.match(errors[0]!.message, /refused/);

    client.close();
  });

  test("a subscription stopped while disconnected is not re-sent", async () => {
    const { client, lastInstance, instances, connectLastSocket } =
      createConnectedClient();

    const subscription = client.subscribe(
      "fetchAndSubscribe",
      subscribePayload,
      () => {},
    );
    ackLastMessage(lastInstance());
    await subscription;

    lastInstance().emitClose({ code: 1006 });
    subscription.stop();
    await delay(20);
    assert.equal(instances.length, 2);
    connectLastSocket();

    assert.deepEqual(getSentMessages(lastInstance()), []);

    client.close();
  });

  test("close() ends subscriptions: a later connect() does not resume them", async () => {
    const { client, lastInstance } = createConnectedClient();

    const subscription = client.subscribe(
      "fetchAndSubscribe",
      subscribePayload,
      () => {},
    );
    ackLastMessage(lastInstance());
    await subscription;

    client.close();
    client.connect();
    lastInstance().emitOpen();
    lastInstance().emitMessage("connection-ack");

    assert.deepEqual(getSentMessages(lastInstance()), []);

    client.close();
  });

  test("a pending ack is rejected when the connection drops", async () => {
    const { client, lastInstance } = createConnectedClient();

    const sendPromise = client.send("fetch", fetchPayload);
    lastInstance().emitClose({ code: 1006 });

    await assert.rejects(sendPromise, /connection state is now/);

    client.close();
  });
});
