/* eslint-disable complexity */
import type { Change, Changes, QueryInfo, QueryMeta } from 'liwi-types';
import { Lazy } from 'mingo/lazy';
import { $sort } from 'mingo/operators/pipeline';

function sortCollection(collection: any, sort: any): any {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return $sort(Lazy(collection), sort, { config: { idKey: '_id' } }).value();
}

const copy = <Value>(state: Value[]): Value[] => state.slice();

const applyCollectionChange = <Value extends any>(
  state: Value[],
  change: Change<any, Value[]>,
  queryMeta: QueryMeta,
  queryInfo: QueryInfo<Value>,
): Value[] => {
  switch (change.type) {
    case 'initial':
      return change.initial;

    case 'inserted': {
      queryMeta.total += change.result.length;

      let newCollection = [...change.result, ...state];

      if (queryInfo.sort) {
        newCollection = sortCollection(newCollection, queryInfo.sort);
      }

      if (!queryInfo.limit) return newCollection;

      return newCollection.slice(0, queryInfo.limit - change.result.length);
    }

    case 'deleted': {
      queryMeta.total -= change.keys.length;

      const keyPath = queryInfo.keyPath;
      const deletedKeys = change.keys;
      return state.filter((value) => !deletedKeys.includes(value[keyPath]));
    }

    case 'updated': {
      const keyPath = queryInfo.keyPath;
      const newState = copy(state);
      change.result.forEach((newObject) => {
        const index = newState.findIndex(
          (o: Value) => o[keyPath] === newObject[keyPath],
        );
        if (index === -1) return;
        newState[index] = newObject;
      });
      return newState;
    }

    default:
      throw new Error('Invalid type');
  }
};

// https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js
export function applyCollectionChanges<Item>(
  state: undefined | Item[],
  changes: Changes<any, Item[]>,
  queryMeta: QueryMeta,
  queryInfo: QueryInfo<Item>,
): { state: undefined | Item[]; meta: QueryMeta } {
  if (state === undefined) return { state, meta: queryMeta };

  const newQueryMeta = { ...queryMeta };

  return {
    // eslint-ignore-next-line unicorn/no-reduce
    state: changes.reduce<Item[]>(
      (result: Item[], change: Change<any, Item[]>) =>
        applyCollectionChange<Item>(result, change, queryMeta, queryInfo),
      state,
    ),
    meta: newQueryMeta,
  };
}
