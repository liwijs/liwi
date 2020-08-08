/* eslint-disable camelcase, complexity */
import { Change, Changes, QueryInfo, QueryMeta } from 'liwi-types';

const applySingleItemChange = <Value extends Record<keyof Value, any>>(
  state: Value | null,
  change: Change<any, Value | null>,
  queryMeta: QueryMeta,
  queryInfo: QueryInfo<Value>,
): Value | null => {
  switch (change.type) {
    case 'initial':
      queryMeta.total = change.initial === null ? 0 : 1;
      return change.initial;

    case 'updated': {
      queryMeta.total = change.result === null ? 0 : 1;
      return change.result;
    }

    case 'deleted': {
      queryMeta.total = 0;
      return null;
    }

    default:
      throw new Error('Invalid type');
  }
};

// https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js
export function applySingleItemChanges<
  Value extends Record<keyof Value, unknown>
>(
  state: undefined | Value | null,
  changes: Changes<any, Value | null>,
  queryMeta: QueryMeta,
  queryInfo: QueryInfo<Value>,
): { state: undefined | Value | null; meta: QueryMeta } {
  if (state === undefined) return { state, meta: queryMeta };

  const newQueryMeta = { ...queryMeta };

  return {
    state: changes.reduce<Value | null>(
      (result: Value | null, change: Change<any, Value | null>) =>
        applySingleItemChange<Value>(result, change, queryMeta, queryInfo),
      state,
    ),
    meta: newQueryMeta,
  };
}
