import _t from 'tcomb-forked';
import deepEqual from 'deep-equal';
// eslint-disable-next-line
import { createAction as alpReactReduxCreateAction } from 'alp-react-redux';

export function createSubscribeAction(actionName) {
  _assert(actionName, _t.String, 'actionName');

  return alpReactReduxCreateAction(actionName, function (change) {
    _assert(change, _t.Object, 'change');

    return { change: change };
  });
}

var ChangeType = _t.interface({
  type: _t.maybe(_t.String),
  state: _t.maybe(_t.String),
  old_offset: _t.maybe(_t.Number),
  new_offset: _t.maybe(_t.Number),
  old_val: _t.maybe(_t.Object),
  new_val: _t.maybe(_t.Object)
}, 'ChangeType');

// https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js


export function subscribeReducer(state, _ref) {
  var change = _ref.change;

  _assert(state, _t.list(_t.Object), 'state');

  _assert({
    change: change
  }, _t.interface({
    change: ChangeType
  }), '{ change }');

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
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=redux.js.map