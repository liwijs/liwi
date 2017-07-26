import deepEqual from 'deep-equal';

// https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js
export default (function (state, change) {
  var type = change.type,
      oldOffset = change.old_offset,
      newOffset = change.new_offset,
      oldVal = change.old_val,
      newVal = change.new_val;


  var copy = function copy() {
    return state = state.slice();
  };

  switch (type) {
    case 'remove':
    case 'uninitial':
      {
        copy();
        // Remove old values from the array
        if (oldOffset != null) {
          state.splice(oldOffset, 1);
        } else {
          var index = state.findIndex(function (x) {
            return deepEqual(x.id, oldVal.id);
          });
          if (index === -1) {
            // Programming error. This should not happen
            throw new Error('change couldn\'t be applied: ' + JSON.stringify(change));
          }
          state.splice(index, 1);
        }
        break;
      }

    case 'initial':
      {
        copy();

        if (newOffset != null) {
          state[newOffset] = newVal;
        } else {
          // If we don't have an offset, find the old val and
          // replace it with the new val
          var _index = state.findIndex(function (x) {
            return deepEqual(x.id, newVal.id);
          });
          if (_index === -1) {
            state.push(newVal);
          } else {
            state[_index] = newVal;
          }
        }
        break;
      }

    case 'add':
      {
        copy();
        // Add new values to the array
        if (newOffset != null) {
          // If we have an offset, put it in the correct location
          state.splice(newOffset, 0, newVal);
        } else {
          // otherwise for unordered results, push it on the end
          state.push(newVal);
        }
        break;
      }

    case 'change':
      {
        copy();

        if (oldOffset === newOffset) {
          state[newOffset] = newVal;
          return state;
        }

        // Modify in place if a change is happening
        if (oldOffset != null) {
          // Remove the old document from the results
          state.splice(oldOffset, 1);
        }

        if (newOffset != null) {
          // Splice in the new val if we have an offset
          state.splice(newOffset, 0, newVal);
        } else {
          // If we don't have an offset, find the old val and
          // replace it with the new val
          var _index2 = state.findIndex(function (x) {
            return deepEqual(x.id, oldVal.id);
          });
          if (_index2 === -1) {
            // indicates a programming bug. The server gives us the
            // ordering, so if we don't find the id it means something is
            // buggy.
            throw new Error('change couldn\'t be applied: ' + JSON.stringify(change));
          } else {
            state[_index2] = newVal;
          }
        }
        break;
      }
    case 'state':
      {
        // This gets hit if we have not emitted yet, and should
        // result in an empty array being output.
        break;
      }
    default:
      throw new Error('unrecognized \'type\' field from server ' + JSON.stringify(change));
  }
  return state;
});
//# sourceMappingURL=applyChange.js.map