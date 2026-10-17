/* eslint-disable complexity */
import type {
  AllowedKeyValue,
  Changes,
  QueryOptions,
  QueryParams,
  QueryResult,
  QuerySubscription,
  SubscribeCallback,
  Transformer,
} from "liwi-store";
import type { Actions } from "liwi-subscribe-store";
import { AbstractSubscribableStoreQuery } from "liwi-subscribe-store";
import { Query as MingoQuery } from "mingo";
import type {
  MongoBaseModel,
  MongoInsertType,
  MongoKeyPath,
} from "./MongoBaseModel";
import type MongoCursor from "./MongoCursor";
import type MongoStore from "./MongoStore";
import { createActionQueue } from "./createActionQueue.ts";

const identityTransformer = <
  Model extends MongoBaseModel<any>,
  Transformed = Model,
>(
  model: Model,
): Transformed => model as unknown as Transformed;

type TestCriteria = (obj: any) => boolean;

interface Memberships<KeyValue, Item> {
  deleted: KeyValue[];
  updated: Item[];
  inserted: Item[];
}

/** the stored state of each document an action is about, `undefined` once deleted */
const getLatestStates = <
  Model extends MongoBaseModel<KeyValue>,
  KeyValue extends AllowedKeyValue,
>(
  action: Exclude<Actions<Model>, { type: "resync" }>,
  keyPath: MongoKeyPath,
): Map<KeyValue, Model | undefined> => {
  const states = new Map<KeyValue, Model | undefined>();
  switch (action.type) {
    case "inserted":
      action.next.forEach((next) => states.set(next[keyPath], next));
      break;
    case "deleted":
      action.prev.forEach((prev) => states.set(prev[keyPath], undefined));
      break;
    case "updated":
      action.changes.forEach(([, next]) => states.set(next[keyPath], next));
      break;
    case "changed":
      action.keys.forEach((key) => states.set(key as KeyValue, undefined));
      action.next.forEach((next) => states.set(next[keyPath], next));
      break;
    default:
      throw new Error("Unsupported type");
  }
  return states;
};

const toCollectionChanges = <KeyValue, Item>({
  deleted,
  updated,
  inserted,
}: Memberships<KeyValue, Item>): Changes<KeyValue, Item[]> => {
  const changes: Changes<KeyValue, Item[]> = [];
  if (deleted.length > 0) changes.push({ type: "deleted", keys: deleted });
  if (updated.length > 0) changes.push({ type: "updated", result: updated });
  if (inserted.length > 0) changes.push({ type: "inserted", result: inserted });
  return changes;
};

export default class MongoQueryCollection<
  Model extends MongoBaseModel<KeyValue>,
  Params extends QueryParams<Params> = never,
  KeyValue extends AllowedKeyValue = Model["_id"],
  Item extends Record<MongoKeyPath, KeyValue> = Model,
> extends AbstractSubscribableStoreQuery<
  MongoKeyPath,
  KeyValue,
  Model,
  MongoInsertType<Model, KeyValue>,
  Params,
  Item[]
> {
  private readonly store: MongoStore<Model, KeyValue>;

  private readonly options: QueryOptions<Model>;

  private testCriteria?: TestCriteria;

  private readonly transformer: Transformer<Model, Item>;

  constructor(
    store: MongoStore<Model, KeyValue>,
    options: QueryOptions<Model>,
    transformer: Transformer<Model, Item> = identityTransformer,
  ) {
    super();
    this.store = store;
    this.options = options;
    this.transformer = transformer;
  }

  createTestCriteria(): TestCriteria {
    if (!this.testCriteria) {
      if (!this.options.criteria) {
        return () => true;
      }

      // criteria not supported by mingo: updates will not work
      if ("$text" in this.options.criteria) {
        return () => false;
      }

      const mingoQuery = new MingoQuery(this.options.criteria);
      this.testCriteria = mingoQuery.test.bind(mingoQuery);
    }
    return this.testCriteria;
  }

  async fetch<T>(onFulfilled: (result: QueryResult<Item[]>) => T): Promise<T> {
    const [result, count] = await Promise.all([
      this.createMongoCursor().then((cursor) => cursor.toArray()),
      this.store.count(this.options.criteria),
    ]);

    return onFulfilled({
      result: result.map(this.transformer),
      meta: { total: count },
      info: {
        sort: this.options.sort,
        limit: this.options.limit,
        keyPath: this.store.keyPath,
      },
    });
  }

  /**
   * Each subscription keeps the keys its client holds, and decides from them and
   * the stored document alone, never from the emitted `prev`: a repeated, late
   * or foreign (`changed`) notification leaves the client equal to a fresh fetch.
   * A subscription opened without its initial result still fetches it, to know
   * those keys. With `limit` or `skip`, a document entering or leaving refetches
   * instead: only the server knows what fills or leaves the window.
   */
  _subscribe(
    callback: SubscribeCallback<KeyValue, Item[]>,
    _includeInitial: boolean,
  ): QuerySubscription {
    const store = super.getSubscribeStore();
    const keyPath = this.store.keyPath;
    let sentKeys = new Set<KeyValue>();
    let isStopped = false;

    const send = (changes: Changes<KeyValue, Item[]>): void => {
      if (!isStopped && changes.length > 0) callback(null, changes);
    };

    const refetch = (): Promise<Changes<KeyValue, Item[]>> =>
      this.fetch(({ result, meta, info }: QueryResult<Item[]>) => {
        sentKeys = new Set(result.map((item) => item[keyPath]));
        return [{ type: "initial", initial: result, queryInfo: info, meta }];
      });

    const initialPromise: Promise<void> = refetch().then((changes) => {
      if (_includeInitial) send(changes);
    });

    const handleAction = (
      action: Actions<Model>,
    ): Promise<void> | undefined => {
      if (isStopped) return undefined;
      if (action.type === "resync") return refetch().then(send);
      if (!this.canTestCriteria()) return undefined;

      const memberships = this.computeMemberships(action, sentKeys);
      if (
        this.isWindowed() &&
        (memberships.inserted.length > 0 || memberships.deleted.length > 0)
      ) {
        return refetch().then(send);
      }

      memberships.deleted.forEach((key) => sentKeys.delete(key));
      memberships.inserted.forEach((item) => sentKeys.add(item[keyPath]));
      send(toCollectionChanges(memberships));
      return undefined;
    };

    const enqueue = createActionQueue(initialPromise, (error) => {
      if (!isStopped) callback(error as Error, []);
    });
    const unsubscribe = store.subscribe((action: Actions<Model>) => {
      enqueue(() => handleAction(action));
    });

    const stop = (): void => {
      isStopped = true;
      unsubscribe();
    };

    return {
      stop,
      cancel: stop,
      then: <T, U>(
        onFulfilled: () => Promise<T> | T,
        onRejected?: (error: any) => Promise<U> | U,
      ): Promise<T | U> => initialPromise.then(onFulfilled, onRejected),
    };
  }

  private canTestCriteria(): boolean {
    return !this.options.criteria || !("$text" in this.options.criteria);
  }

  private isWindowed(): boolean {
    return !!this.options.limit || !!this.options.skip;
  }

  private computeMemberships(
    action: Exclude<Actions<Model>, { type: "resync" }>,
    sentKeys: ReadonlySet<KeyValue>,
  ): Memberships<KeyValue, Item> {
    const testCriteria = this.createTestCriteria();
    const memberships: Memberships<KeyValue, Item> = {
      deleted: [],
      updated: [],
      inserted: [],
    };

    getLatestStates<Model, KeyValue>(action, this.store.keyPath).forEach(
      (next, key) => {
        const isSent = sentKeys.has(key);
        const isMatching = next !== undefined && testCriteria(next);
        if (isSent && isMatching) {
          memberships.updated.push(this.transformer(next));
        } else if (isSent) {
          memberships.deleted.push(key);
        } else if (isMatching) {
          memberships.inserted.push(this.transformer(next));
        }
      },
    );

    return memberships;
  }

  private async createMongoCursor(): Promise<
    MongoCursor<Model, Model, KeyValue>
  > {
    const cursor = await this.store.cursor(
      this.options.criteria,
      this.options.sort,
      this.options.fields,
    );

    if (this.options.skip) {
      cursor.advance(this.options.skip);
    }

    if (this.options.limit) {
      await cursor.limit(this.options.limit);
    }

    return cursor;
  }
}
