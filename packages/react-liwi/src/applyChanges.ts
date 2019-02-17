/* eslint-disable camelcase, complexity */
import { Change, Changes } from 'liwi-types';

const copy = <Value>(state: Value[]): Value[] => state.slice();

const applyChange = <
  KeyPath extends string,
  Value extends { [K in KeyPath]: any }
>(
  state: Value[],
  change: Change<Value>,
  keyPath: KeyPath,
): Value[] => {
  switch (change.type) {
    case 'initial':
      return change.initial;

    case 'inserted': {
      return [...change.objects, ...state.slice(0, -change.objects.length)];
    }

    case 'deleted': {
      const deletedKeys = change.keys;
      return state.filter((value) => !deletedKeys.includes(value[keyPath]));
    }

    case 'updated': {
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
export default <Value>(
  state: undefined | Value[],
  changes: Changes<Value>,
  keyPath: string,
): undefined | Value[] => {
  if (changes.length === 1) {
    const firstChange = changes[0];
    if (firstChange.type === 'initial') {
      return firstChange.initial;
    }
  }

  if (state === undefined) return state;

  return changes.reduce(
    (stateValue: Value[], change: Change<Value>) =>
      applyChange(stateValue, change, keyPath),
    state,
  );
};
