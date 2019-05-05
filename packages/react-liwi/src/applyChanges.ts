/* eslint-disable camelcase, complexity */
import { Change, Changes, QueryInfo } from 'liwi-types';

const copy = <Value>(state: Value[]): Value[] => state.slice();

const applyChange = <Value extends any>(
  state: Value[],
  change: Change<Value>,
  queryInfo: QueryInfo,
): Value[] => {
  switch (change.type) {
    case 'initial':
      return change.initial;

    case 'inserted': {
      return [
        ...change.objects,
        ...(!queryInfo.limit ? state : state.slice(0, -queryInfo.limit)),
      ];
    }

    case 'deleted': {
      const keyPath = queryInfo.keyPath;
      const deletedKeys = change.keys;
      return state.filter((value) => !deletedKeys.includes(value[keyPath]));
    }

    case 'updated': {
      const keyPath = queryInfo.keyPath;
      const newState = copy(state);
      change.objects.forEach((newObject) => {
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
export default function applyChanges<Value>(
  state: undefined | Value[],
  changes: Changes<Value>,
  queryInfo: QueryInfo,
): undefined | Value[] {
  if (state === undefined) return state;

  return changes.reduce(
    (stateValue: Value[], change: Change<Value>) =>
      applyChange(stateValue, change, queryInfo),
    state,
  );
}
