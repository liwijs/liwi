# liwi: relay store writes from one process to another

Status: implemented on branch `feat/store-relay`, see [§6](#6-implementation-notes) for
where it departs from this text. Date: 2026-10-17. Requester: reviewflow (decision D1 in
`reviewflow/docs/reviewflow-read-api-tracking.md`).
Audience: whoever implements this in the liwi monorepo, human or agent.

Statements about liwi below were read from HEAD `7a8f0d85`.

## 1. Problem

`SubscribeStore` notifies its listeners in-process only. reviewflow runs two node processes
on one mongo database: the bot writes (GitHub webhooks), the webapp-server holds the
resources websocket. A write made by the bot never reaches a webapp-server subscription.

Mongo change streams would solve it but need a replica set, and reviewflow's production
mongod is a standalone shared with other projects. Rejected for now.

## 2. Decisions

- **Transport: liwi's own websocket transport.** The producer process exposes a resource
  with `createWsServer`; the consumer connects with `createNodeWebsocketTransportClient`.
  Reconnection with backoff, re-subscription after reconnect, server pings and
  `extended-json` already exist.
- **State-based, not `[prev, next]`-based.** The relay carries keys only. The consumer
  re-reads the documents and each subscription decides from what it already sent. No
  `prev` crosses the wire, so stale or duplicated notifications are harmless.
- **One producer, one consumer.** Several instances of either side are out of scope: they
  would use a broker (RabbitMQ or similar), not this relay.
- **Authentication is unchanged.** `createWsServer` accepts unauthenticated connections by
  design (some apps serve public queries). The relay resource checks the authenticated user
  itself and throws when it is not allowed.
- **Gaps are healed by resync, not replay.** Notifications sent while disconnected are lost;
  on reconnect every consumer-side subscription refetches.

## 3. Changes

### L1 — `SubscribeStore.notifyChanged(keys)` and per-subscription key tracking

`liwi-subscribe-store`, `liwi-mongo`.

- `notifyChanged(keys: KeyValue[]): Promise<void>` on `SubscribeStore`: one
  `findAll({ [keyPath]: { $in: keys } })` per call (not per subscription), then emits a new
  action `{ type: "changed"; keys: KeyValue[]; next: Model[] }`. A key absent from `next` was
  deleted.
- `MongoQueryCollection` keeps, per subscription, the set of keys the client holds:
  filled by `initial`, kept current by every emitted change (all action types, not only
  `changed`). A subscription opened with `subscribe` (no initial) fetches the keys without
  sending them, so the set is always known.
- On `changed`, per key:

  | In the set | Re-read document matches criteria | Emitted    |
  | ---------- | --------------------------------- | ---------- |
  | yes        | yes                               | `updated`  |
  | yes        | no, or deleted                    | `deleted`  |
  | no         | yes                               | `inserted` |
  | no         | no, or deleted                    | nothing    |

- Queries with `limit`: when a key enters or leaves the result, resync that subscription
  (L2) instead of emitting `inserted` / `deleted`. The server cannot know which document the
  client evicts or which one should fill a freed slot. Updates in place stay `updated`;
  re-sorting updated rows is a known, separate limitation of `applyCollectionChanges`.
- `MongoQuerySingleItem`: when a re-read document matches the criteria or its key is the
  current item's, refetch and emit `updated`.
- `inserted` for a key already in the set is emitted as `updated`; `deleted` for a key not
  in the set is dropped. This keeps `meta.total` right on the client, whose
  `applyCollectionChanges` duplicates on a repeated insert and decrements `total` on an
  unknown delete.

### L2 — `SubscribeStore.resync()`

- Every live subscription of the store refetches and emits `initial`. `react-liwi`'s
  `applyCollectionChange` already accepts `initial` at any time, keeping references of
  unchanged rows.
- Also exposed per subscription, for L1's `limit` case.
- Uses in reviewflow: heal a relay gap; refetch when a document drives a subscription's scope
  (org membership) rather than its rows.

### L3 — The relay

New package `liwi-store-relay`, or a module of `liwi-subscribe-store` if the dependencies
allow it (it must not pull a transport into the store packages).

Producer, `createStoreRelayResource({ stores, authorize, heartbeatIntervalMs })`:

- `stores`: `Record<string, SubscribeStore>`; the name is the wire identifier.
- Returns a `ServiceResource` with one query, `queryChanges`. Its subscription:
  1. registers a listener on every store first;
  2. then emits an `initial` with an empty result, so the consumer knows the listeners are
     live;
  3. then emits batches `{ store: string; keys: KeyValue[] }[]`, deduplicated, flushed once
     per macrotask. Keys come from `next` for `inserted`, `prev` for `deleted`, `next` for
     `updated`.
  4. emits an empty batch every `heartbeatIntervalMs`, so the consumer can tell a quiet
     producer from a dead one.
- `authorize(authenticatedUser)` returns a boolean; `queryChanges` throws
  `ResourcesServerError("FORBIDDEN")` when false.
- Registering a listener makes the producer's stores read `prev` on every write
  (`hasListeners()`): partial updates cost two round trips instead of one, and
  `partialUpdateMany` / `deleteMany` become 1 + 2N. Measured acceptable for reviewflow; say
  it in the API docs.

Consumer, `connectStoreRelay({ transportClient, stores, onStateChange })`:

- Subscribes to `queryChanges` with `fetchAndSubscribe`.
- On every `initial`, including the first (subscriptions opened before the relay connected
  missed writes too): `resync()` on every store.
- On a batch: `notifyChanged(keys)` on the named store. An unknown store name is logged and
  skipped.
- Reports `{ connected: boolean; lastMessageAt: Date | null }` through `onStateChange`, for
  health endpoints.
- Returns `{ close() }`.

The resources server forwards subscription results as-is (`createMessageHandler.ts:112-117`),
so batches need no transport change. The `Changes` typing on the client side may need
widening for a non-collection result: check `SubscribeCallback` before casting.

### L4 — Reconnection TODOs in `liwi-resources-websocket-client`

`createWebsocketTransportClient.ts`:

- **Re-subscription failure is swallowed.** After a reconnect, `sendWithAck(...).then(subscription.resolve, subscription.reject)`
  (line 287) settles an already settled promise: a refused re-subscription is silent and
  the subscription is dead. Route the error to `subscription.callback(error, null)`.
- **Closed subscriptions stay in the map.** On `closed` (line 301) subscriptions are
  rejected but not removed; a later `connect()` resends them. Remove them, or document that
  `connect()` after `close()` resumes them and stop rejecting.
- **`stop` during a reconnection** (TODO line 257): the server drops every subscription when
  the socket closes (`createMessageHandler.ts:144-147`), so a local delete is enough. Prove
  it with a test, then remove the TODO.
- **Resubscriptions after reconnect** (TODO line 102) and **reject on connection close**
  (TODO line 104) are implemented (lines 282-307): cover them with tests, remove the TODOs.
- Line 103 (send before connected throws `NetworkError`) is unrelated to reconnection: leave
  it.

Integration test with a real server (`createNodeWebsocketTransportClient.integration.test.ts`
has the setup): subscribe, stop the server, write, restart it; the subscription receives a
new `initial`; a `stop` while disconnected leaves no subscription on the server.

## 4. Acceptance

1. A write through a producer-side `SubscribeStore` reaches a consumer-side
   `MongoQueryCollection` subscription, including a document leaving its criteria.
2. The same `notifyChanged` delivered twice, or out of order with a local write, leaves the
   client state equal to a fresh fetch.
3. A query with `limit: 2` and 3 matching documents: deleting one of the 2 shown brings the
   third in.
4. Producer restarted: the consumer reconnects, every subscription receives `initial`, and a
   write made while it was down is visible.
5. A connection that `authorize` refuses gets an error on `queryChanges`.
6. Each L4 item has a test; the TODOs it covers are gone.

## 5. Out of scope

- Several producers or consumers (use a broker).
- Writes that bypass `SubscribeStore` (raw collection, other applications): not relayed,
  visible on the next refetch.
- Re-sorting updated rows in `applyCollectionChanges`.

## 6. Implementation notes

- **No new package.** The producer is `createStoreRelayResource` in `liwi-resources-server`,
  the consumer `connectStoreRelay` in `liwi-resources-client`, the wire types
  (`StoreRelayBatch`, `StoreRelayService`) in `liwi-resources`. Neither depends on
  `liwi-subscribe-store`: they take any store with `subscribeChangedKeys`, respectively
  `notifyChanged` and `resync`.
- **`SubscribeStore.subscribeChangedKeys(callback)`** was added, so that the producer does not
  re-derive keys from each action type.
- **Key tracking applies to every action**, not only `changed`: a local `updated` is decided
  from the held keys and `next`, its `prev` is ignored. `$text` queries still never emit
  pushed changes (mingo cannot test them); `resync` still refetches them.
- **Changes are computed serially per subscription** (`liwi-mongo/src/createActionQueue.ts`):
  synchronously during the write call while nothing is pending, as before; behind the
  initial fetch or a refetch otherwise.
- **`MongoQuerySingleItem`** tracks the key it sent; `resync` sends `initial`.
- **Batches** travel as `inserted` changes of a log-like result, so the existing `Changes`
  typing needed no widening; a heartbeat is an empty batch.
- **L4.** The first failure of a subscription still rejects its thenable (unchanged); later,
  a refusal while connected reaches the callback, a disconnection is retried. TODO line 103
  (send before connected) is kept: unrelated to reconnection.
- **End-to-end test**: `liwi-resources-websocket-server/src/storeRelay.integration.test.ts`
  (real `createWsServer`, node client, fake stores). Store-side behaviour is tested on the
  in-memory mongo client in `liwi-mongo/src/MongoQuerySubscription.test.ts`.
