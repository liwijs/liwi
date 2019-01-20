import mingo from 'mingo';
import { SubscribeResult, SubscribeCallback } from 'liwi-store';
import { Changes, QueryOptions } from 'liwi-types';
import { AbstractSubscribeQuery, Actions } from 'liwi-subscribe-store';
import MongoStore, { MongoModel } from './MongoStore';

export default class MongoQuery<
  Model extends MongoModel
> extends AbstractSubscribeQuery<Model, MongoStore<Model>> {
  private readonly store: MongoStore<Model>;

  private readonly options: QueryOptions<Model>;

  private mingoQuery?: mingo.Query;

  constructor(store: MongoStore<Model>, options: QueryOptions<Model>) {
    super();
    this.store = store;
    this.options = options;
  }

  createMingoQuery(): mingo.Query {
    if (!this.mingoQuery) {
      this.mingoQuery = new mingo.Query(this.options.criteria);
    }

    return this.mingoQuery;
  }

  async fetch<T>(onFulfilled: (result: Array<Model>) => T): Promise<T> {
    const cursor = await this.createMongoCursor();
    return cursor.toArray().then(onFulfilled);
  }

  _subscribe(
    callback: SubscribeCallback<Model>,
    _includeInitial: boolean,
    args: Array<any>,
  ): SubscribeResult {
    const store = super.getSubscribeStore();
    const mingoQuery: mingo.Query = this.createMingoQuery();

    const promise =
      _includeInitial &&
      this.fetch((result: Array<Model>) => {
        callback(null, [{ type: 'initial', initial: result }]);
        return result;
      });

    const unsubscribe = store.subscribe((action: Actions<Model>) => {
      const filtered = (action.type === 'inserted'
        ? action.next
        : action.prev
      ).filter((object: Model) => mingoQuery.test(object));
      const changes: Changes<Model> = [];
      switch (action.type) {
        case 'inserted':
          changes.push({ type: 'inserted', objects: filtered });
          break;
        case 'deleted':
          changes.push({
            type: 'deleted',
            keys: filtered.map((object: Model) => object[this.store.keyPath]),
          });
          break;
        case 'updated': {
          const { deleted, updated } = filtered.reduce(
            (
              acc: { deleted: Array<string>; updated: Array<Model> },
              object: Model,
              index: number,
            ) => {
              const nextObject = action.next[index];
              if (!mingoQuery.test(nextObject)) {
                acc.deleted.push(object[this.store.keyPath]);
              } else {
                acc.updated.push(nextObject);
              }

              return acc;
            },
            { deleted: [], updated: [] },
          );

          if (deleted.length !== 0) {
            changes.push({ type: 'deleted', keys: deleted });
          }
          if (updated.length !== 0) {
            changes.push({ type: 'updated', objects: updated });
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
      then: _includeInitial
        ? (onFulfilled: (result: Array<Model>) => any) =>
            (promise as Promise<Array<Model>>).then(onFulfilled)
        : () => Promise.resolve(),
    };
  }

  private async createMongoCursor() {
    const cursor = await this.store.cursor(
      this.options.criteria,
      this.options.sort,
    );

    if (this.options.limit) {
      await cursor.limit(this.options.limit);
    }

    return cursor;
  }
}
