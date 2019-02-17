import mingo from 'mingo';
import { SubscribeResult, SubscribeCallback } from 'liwi-store';
import { Changes, QueryOptions, Transformer } from 'liwi-types';
import { AbstractSubscribeQuery, Actions } from 'liwi-subscribe-store';
import MongoStore, { MongoModel } from './MongoStore';

const identityTransformer = <Model extends MongoModel, Transformed = Model>(
  model: Model,
): Transformed => (model as unknown) as Transformed;

export default class MongoQuery<
  Model extends MongoModel,
  Transformed = Model
> extends AbstractSubscribeQuery<Model, MongoStore<Model>, Transformed> {
  private readonly store: MongoStore<Model>;

  private readonly options: QueryOptions<Model>;

  private mingoQuery?: mingo.Query;

  private readonly transformer: Transformer<Model, Transformed>;

  constructor(
    store: MongoStore<Model>,
    options: QueryOptions<Model>,
    transformer: Transformer<Model, Transformed> = identityTransformer,
  ) {
    super();
    this.store = store;
    this.options = options;
    this.transformer = transformer;
  }

  createMingoQuery(): mingo.Query {
    if (!this.mingoQuery) {
      this.mingoQuery = new mingo.Query(this.options.criteria);
    }

    return this.mingoQuery;
  }

  async fetch<T>(onFulfilled: (result: Transformed[]) => T): Promise<T> {
    const cursor = await this.createMongoCursor();
    return cursor
      .toArray()
      .then((result: Model[]) => result.map(this.transformer))
      .then(onFulfilled);
  }

  _subscribe(
    callback: SubscribeCallback<Transformed>,
    _includeInitial: boolean,
  ): SubscribeResult<Transformed[]> {
    const store = super.getSubscribeStore();
    const mingoQuery: mingo.Query = this.createMingoQuery();

    const promise =
      _includeInitial &&
      this.fetch((result: Transformed[]) => {
        callback(null, [{ type: 'initial', initial: result }]);
        return result;
      });

    const unsubscribe = store.subscribe((action: Actions<Model>) => {
      const filtered = (action.type === 'inserted'
        ? action.next
        : action.prev
      ).filter((object: Model) => mingoQuery.test(object));
      const changes: Changes<Transformed> = [];
      switch (action.type) {
        case 'inserted':
          changes.push({
            type: 'inserted',
            objects: filtered.map(this.transformer),
          });
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
              acc: { deleted: string[]; updated: Transformed[] },
              object: Model,
              index: number,
            ) => {
              const nextObject = action.next[index];
              if (!mingoQuery.test(nextObject)) {
                acc.deleted.push(object[this.store.keyPath]);
              } else {
                acc.updated.push(this.transformer(nextObject));
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
        ? (
            onFulfilled: (result: Transformed[]) => any,
            onRejected?: (error: any) => any,
          ) => (promise as Promise<Transformed[]>).then(onFulfilled, onRejected)
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
