import type { Changes, QueryInfo, QueryMeta } from 'liwi-store';

export type ApplyChanges<Result, Value> = (
  state: undefined | Result,
  changes: Changes<any, Result>,
  queryMeta: QueryMeta,
  queryInfo: QueryInfo<Value>,
) => { state: undefined | Result; meta: QueryMeta };
