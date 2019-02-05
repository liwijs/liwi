/* eslint-disable camelcase, complexity */
import { BaseModel, Change, Changes } from 'liwi-types';

const copy = <Model>(state: Model[]) => state.slice();

const applyChange = <Model extends BaseModel>(
  state: Model[],
  change: Change<Model>,
  keyPath: string,
): Model[] => {
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
          (o: Model) => o[keyPath] === newObject[keyPath],
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
export default <Model extends BaseModel>(
  state: undefined | Model[],
  changes: Changes<Model>,
  keyPath: string,
): undefined | Model[] => {
  if (changes.length === 1) {
    const firstChange = changes[0];
    if (firstChange.type === 'initial') {
      return firstChange.initial;
    }
  }

  if (state === undefined) return state;

  return changes.reduce(
    (stateValue: Model[], change: Change<Model>) =>
      applyChange(stateValue, change, keyPath),
    state,
  );
};
