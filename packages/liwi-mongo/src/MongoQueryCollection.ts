/* eslint-disable complexity, max-lines */
import type {
  QuerySubscription,
  SubscribeCallback,
  QueryResult,
} from 'liwi-store';
import type { Actions } from 'liwi-subscribe-store';
import { AbstractSubscribableStoreQuery } from 'liwi-subscribe-store';
import type {
  Changes,
  QueryOptions,
  Transformer,
  AllowedKeyValue,
} from 'liwi-types';
import mingo from 'mingo';
import type {
  MongoBaseModel,
  MongoInsertType,
  MongoKeyPath,
} from './MongoBaseModel';
import type MongoCursor from './MongoCursor';
import type MongoStore from './MongoStore';

const identityTransformer = <
  Model extends MongoBaseModel<any>,
  Transformed = Model
>(
  model: Model,
): Transformed => (model as unknown) as Transformed;

type TestCriteria = (obj: any) => boolean;

export default class MongoQueryCollection<
  Model extends MongoBaseModel<KeyValue>,
  KeyValue extends AllowedKeyValue = Model['_id'],
  ModelInsertType extends MongoInsertType<Model> = MongoInsertType<Model>,
  Item extends Record<MongoKeyPath, KeyValue> = Model
> extends AbstractSubscribableStoreQuery<
  MongoKeyPath,
  KeyValue,
  Model,
  ModelInsertType,
  Item[]
> {
  private readonly store: MongoStore<Model, KeyValue, ModelInsertType>;

  private readonly options: QueryOptions<Model>;

  private testCriteria?: TestCriteria;

  private readonly transformer: Transformer<Model, Item>;

  constructor(
    store: MongoStore<Model, KeyValue, ModelInsertType>,
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

      const mingoQuery = new mingo.Query(this.options.criteria);
      this.testCriteria = mingoQuery.test.bind(mingoQuery);
    }
    return this.testCriteria;
  }

  async fetch<T>(onFulfilled: (result: QueryResult<Item[]>) => T): Promise<T> {
    const cursor = await this.createMongoCursor();
    const [result, count] = await Promise.all([
      cursor.toArray(),
      cursor.count(),
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

  _subscribe(
    callback: SubscribeCallback<KeyValue, Item[]>,
    _includeInitial: boolean,
  ): QuerySubscription {
    const store = super.getSubscribeStore();
    const testCriteria: TestCriteria = this.createTestCriteria();

    const promise: Promise<void> = _includeInitial
      ? this.fetch(({ result, meta, info }: QueryResult<Item[]>) => {
          callback(null, [
            {
              type: 'initial',
              initial: result,
              queryInfo: info,
              meta,
            },
          ]);
        })
      : Promise.resolve();

    const unsubscribe = store.subscribe((action: Actions<Model>) => {
      const changes: Changes<KeyValue, Item[]> = [];
      switch (action.type) {
        case 'inserted': {
          const filtered = action.next.filter(testCriteria);
          if (filtered.length > 0) {
            changes.push({
              type: 'inserted',
              result: filtered.map(this.transformer),
            });
          }
          break;
        }
        case 'deleted': {
          const filtered = action.prev.filter(testCriteria);
          if (filtered.length > 0) {
            changes.push({
              type: 'deleted',
              keys: filtered.map((object) => object[this.store.keyPath]),
            });
          }
          break;
        }
        case 'updated': {
          const { deleted, updated, inserted } = action.changes.reduce(
            (
              acc: {
                deleted: KeyValue[];
                updated: Item[];
                inserted: Item[];
              },
              [prevObject, nextObject]: [Model, Model],
              index: number,
            ) => {
              if (testCriteria(prevObject)) {
                if (!testCriteria(nextObject)) {
                  acc.deleted.push(prevObject[this.store.keyPath]);
                } else {
                  acc.updated.push(this.transformer(nextObject));
                }
              } else if (testCriteria(nextObject)) {
                acc.inserted.push(this.transformer(nextObject));
              }

              return acc;
            },
            { deleted: [], updated: [], inserted: [] },
          );

          if (deleted.length > 0) {
            changes.push({ type: 'deleted', keys: deleted });
          }
          if (updated.length > 0) {
            changes.push({ type: 'updated', result: updated });
          }
          if (inserted.length > 0) {
            changes.push({ type: 'inserted', result: inserted });
          }

          break;
        }
        default:
          throw new Error('Unsupported type');
      }

      if (changes.length === 0) return;

      callback(null, changes);
    });
    // let _feed;
    // const promise = this.queryCallback(this.store.query(), this.store.r)
    //   .changes({
    //     includeInitial: _includeInitial,
    //     includeStates: true,
    //     includeTypes: true,
    //     includeOffsets: true,
    //   })
    //   .then((feed) => {
    //     if (args.length === 0) {
    //       _feed = feed;
    //       delete this._promise;
    //     }
    //
    //     feed.each(callback);
    //     return feed;
    //   });
    //
    // if (args.length === 0) this._promise = promise;

    return {
      stop: unsubscribe,
      cancel: unsubscribe,
      then: <T, U>(
        onFulfilled: () => T | Promise<T>,
        onRejected?: (error: any) => U | Promise<U>,
      ): Promise<T | U> => promise.then(onFulfilled, onRejected),
    };
  }

  private async createMongoCursor(): Promise<
    MongoCursor<Model, Model, KeyValue, ModelInsertType>
  > {
    const cursor = await this.store.cursor(
      this.options.criteria,
      this.options.sort,
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
