import deepEqual from 'deep-equal';

import t from 'flow-runtime';
const ObjectArrayType = t.type('ObjectArrayType', t.array(t.object()));
const ChangeType = t.type('ChangeType', t.object(t.property('type', t.string()), t.property('state', t.nullable(t.string())), t.property('old_offset', t.nullable(t.number())), t.property('new_offset', t.nullable(t.number())), t.property('old_val', t.nullable(t.object())), t.property('new_val', t.nullable(t.object()))));

// https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js

export default (function applyChange(state, change) {
  let _stateType = ObjectArrayType;
  t.param('state', _stateType).assert(state), t.param('change', ChangeType).assert(change);

  const {
    type,
    old_offset: oldOffset,
    new_offset: newOffset,
    old_val: oldVal,
    new_val: newVal
  } = change;

  const copy = function copy() {
    return state = _stateType.assert(state.slice());
  };

  switch (type) {
    case 'remove':
    case 'uninitial':
      {
        // Remove old values from the array
        if (copy(), oldOffset != null) state.splice(oldOffset, 1);else {
          const index = state.findIndex(function (x) {
            return deepEqual(x.id, oldVal.id);
          });
          if (index === -1)
            // Programming error. This should not happen
            throw new Error(`change couldn't be applied: ${JSON.stringify(change)}`);
          state.splice(index, 1);
        }
        break;
      }

    case 'initial':
      {

        if (copy(), newOffset != null) state[newOffset] = newVal;else {
          // If we don't have an offset, find the old val and
          // replace it with the new val
          const index = state.findIndex(function (x) {
            return deepEqual(x.id, newVal.id);
          });
          index === -1 ? state.push(newVal) : state[index] = newVal;
        }
        break;
      }

    case 'add':
      {
        copy(), newOffset == null ? state.push(newVal) : state.splice(newOffset, 0, newVal);

        break;
      }

    case 'change':
      {

        if (copy(), oldOffset === newOffset) return state[newOffset] = newVal, state;

        // Modify in place if a change is happening


        if (oldOffset != null && state.splice(oldOffset, 1), newOffset != null) state.splice(newOffset, 0, newVal);else {
          // If we don't have an offset, find the old val and
          // replace it with the new val
          const index = state.findIndex(function (x) {
            return deepEqual(x.id, oldVal.id);
          });
          if (index === -1)
            // indicates a programming bug. The server gives us the
            // ordering, so if we don't find the id it means something is
            // buggy.
            throw new Error(`change couldn't be applied: ${JSON.stringify(change)}`);else state[index] = newVal;
        }
        break;
      }
    case 'state':
      // This gets hit if we have not emitted yet, and should
      // result in an empty array being output.
      break;

    default:
      throw new Error(`unrecognized 'type' field from server ${JSON.stringify(change)}`);
  }
  return state;
});
//# sourceMappingURL=applyChange.js.map