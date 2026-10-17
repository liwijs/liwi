import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { after, afterEach, before, describe, test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import type {
  RelayTargetStore,
  StoreRelayConnection,
  StoreRelayState,
  TransportClient,
} from "liwi-resources-client";
import { connectStoreRelay } from "liwi-resources-client";
import type { RelayedStore } from "liwi-resources-server";
import {
  ResourcesServerService,
  createStoreRelayResource,
} from "liwi-resources-server";
import { createNodeWebsocketTransportClient } from "liwi-resources-websocket-client-node";
import type { AllowedKeyValue } from "liwi-store";
import { createWsServer } from "./index.ts";

const secret = "Bearer secret";

interface FakeProducerStore extends RelayedStore {
  write: (keys: AllowedKeyValue[]) => void;
}

const createFakeProducerStore = (): FakeProducerStore => {
  const callbacks = new Set<(keys: AllowedKeyValue[]) => unknown>();
  return {
    subscribeChangedKeys: (callback) => {
      callbacks.add(callback);
      return () => callbacks.delete(callback);
    },
    write: (keys) => {
      callbacks.forEach((callback) => callback(keys));
    },
  };
};

interface FakeTargetStore extends RelayTargetStore {
  notified: AllowedKeyValue[][];
  resyncCount: number;
}

const createFakeTargetStore = (): FakeTargetStore => {
  const store: FakeTargetStore = {
    notified: [],
    resyncCount: 0,
    notifyChanged: (keys) => {
      store.notified.push(keys);
      return Promise.resolve();
    },
    resync: () => {
      store.resyncCount++;
    },
  };
  return store;
};

const waitFor = async (condition: () => boolean): Promise<void> => {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (condition()) return;
    await delay(10);
  }
  assert.fail("condition not met within 1s");
};

describe("store relay over websocket (integration)", () => {
  const httpServer = createServer();
  const producerStore = createFakeProducerStore();
  const wsServer = createWsServer(
    httpServer,
    "/ws",
    new ResourcesServerService({
      serviceResources: new Map([
        [
          "storeRelay",
          createStoreRelayResource<"producer">({
            stores: { items: producerStore },
            authorize: (user) => user === "producer",
            heartbeatIntervalMs: 50,
          }),
        ],
      ]),
    }),
    (request) => (request.headers.authorization === secret ? "producer" : null),
  );
  let url: string;
  let transportClient: TransportClient | undefined;
  let relay: StoreRelayConnection | undefined;

  const connect = (
    authorization: string,
  ): {
    targetStore: FakeTargetStore;
    errors: unknown[];
    states: StoreRelayState[];
  } => {
    const targetStore = createFakeTargetStore();
    const errors: unknown[] = [];
    const states: StoreRelayState[] = [];
    transportClient = createNodeWebsocketTransportClient({
      url,
      headers: { authorization },
      reconnectionDelayMin: 10,
      reconnectionDelayMax: 10,
      onError: () => {},
    });
    transportClient.connect();
    relay = connectStoreRelay({
      transportClient,
      resourceName: "storeRelay",
      stores: { items: targetStore },
      onStateChange: (state) => states.push(state),
      onError: (error) => errors.push(error),
    });
    return { targetStore, errors, states };
  };

  before(async () => {
    await new Promise<void>((resolve) => {
      httpServer.listen(0, "127.0.0.1", resolve);
    });
    const { port } = httpServer.address() as AddressInfo;
    url = `ws://127.0.0.1:${port}/ws`;
  });

  afterEach(() => {
    relay?.close();
    transportClient?.close();
  });

  after(async () => {
    wsServer.close();
    await new Promise<void>((resolve, reject) => {
      httpServer.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  });

  test("resyncs once listening, then relays the written keys in one batch", async () => {
    const { targetStore, errors } = connect(secret);
    await waitFor(() => targetStore.resyncCount === 1);
    assert.equal(relay!.getState().isLive, true);

    producerStore.write(["1"]);
    producerStore.write(["2", "1"]);

    await waitFor(() => targetStore.notified.length > 0);
    assert.deepEqual(targetStore.notified, [["1", "2"]]);
    assert.deepEqual(errors, []);
  });

  test("heartbeats keep lastMessageAt moving", async () => {
    const { targetStore } = connect(secret);
    await waitFor(() => targetStore.resyncCount === 1);
    const firstMessageAt = relay!.getState().lastMessageAt!;

    await waitFor(
      () =>
        relay!.getState().lastMessageAt!.getTime() > firstMessageAt.getTime(),
    );
    assert.deepEqual(targetStore.notified, []);
  });

  test("a connection authorize refuses gets an error and never goes live", async () => {
    const { targetStore, errors } = connect("Bearer wrong");

    await waitFor(() => errors.length > 0);
    assert.match(String(errors[0]), /Not allowed to read the store relay/);
    assert.equal(relay!.getState().isLive, false);
    assert.equal(targetStore.resyncCount, 0);
  });

  test("resyncs again after the connection dropped, then relays", async () => {
    const { targetStore, states } = connect(secret);
    await waitFor(() => targetStore.resyncCount === 1);

    wsServer.wss.clients.forEach((client) => {
      client.terminate();
    });
    await waitFor(() => targetStore.resyncCount === 2);
    assert.ok(
      states.some((state) => !state.isLive),
      "the drop should be reported",
    );
    assert.equal(relay!.getState().isLive, true);

    producerStore.write(["3"]);
    await waitFor(() => targetStore.notified.length > 0);
    assert.deepEqual(targetStore.notified, [["3"]]);
  });
});
