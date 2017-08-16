'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js
exports.default = (state, change) => {
  const {
    type,
    old_offset: oldOffset,
    new_offset: newOffset,
    old_val: oldVal,
    new_val: newVal
  } = change;

  const copy = () => state = state.slice();

  switch (type) {
    case 'remove':
    case 'uninitial':
      {
        // Remove old values from the array
        if (copy(), oldOffset != null) state.splice(oldOffset, 1);else {
          const index = state.findIndex(x => (0, _deepEqual2.default)(x.id, oldVal.id));
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
          const index = state.findIndex(x => (0, _deepEqual2.default)(x.id, newVal.id));
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
          const index = state.findIndex(x => (0, _deepEqual2.default)(x.id, oldVal.id));
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
};
//# sourceMappingURL=applyChange.js.map