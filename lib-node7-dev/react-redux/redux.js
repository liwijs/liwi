'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSubscribeAction = createSubscribeAction;
exports.subscribeReducer = subscribeReducer;

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _alpReactRedux = require('alp-react-redux');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line
function createSubscribeAction(actionName) {
  let _actionNameType = _flowRuntime2.default.string();

  _flowRuntime2.default.param('actionName', _actionNameType).assert(actionName);

  return (0, _alpReactRedux.createAction)(actionName, change => {
    let _changeType = _flowRuntime2.default.object();

    _flowRuntime2.default.param('change', _changeType).assert(change);

    return { change };
  });
}

const ChangeType = _flowRuntime2.default.type('ChangeType', _flowRuntime2.default.object(_flowRuntime2.default.property('type', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('state', _flowRuntime2.default.nullable(_flowRuntime2.default.string())), _flowRuntime2.default.property('old_offset', _flowRuntime2.default.nullable(_flowRuntime2.default.number())), _flowRuntime2.default.property('new_offset', _flowRuntime2.default.nullable(_flowRuntime2.default.number())), _flowRuntime2.default.property('old_val', _flowRuntime2.default.nullable(_flowRuntime2.default.object())), _flowRuntime2.default.property('new_val', _flowRuntime2.default.nullable(_flowRuntime2.default.object()))));

// https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js


function subscribeReducer(state, _arg) {
  let _stateType = _flowRuntime2.default.array(_flowRuntime2.default.object());

  _flowRuntime2.default.param('state', _stateType).assert(state);

  let { change } = _flowRuntime2.default.object(_flowRuntime2.default.property('change', ChangeType)).assert(_arg);

  const {
    type,
    old_offset: oldOffset,
    new_offset: newOffset,
    old_val: oldVal,
    new_val: newVal
  } = change;

  const copy = () => state = _stateType.assert(state.slice());

  switch (type) {
    case 'remove':
    case 'uninitial':
      {
        copy();
        // Remove old values from the array
        if (oldOffset != null) {
          state.splice(oldOffset, 1);
        } else {
          const index = state.findIndex(x => (0, _deepEqual2.default)(x.id, oldVal.id));
          if (index === -1) {
            // Programming error. This should not happen
            throw new Error(`change couldn't be applied: ${JSON.stringify(change)}`);
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
          const index = state.findIndex(x => (0, _deepEqual2.default)(x.id, newVal.id));
          if (index === -1) {
            state.push(newVal);
          } else {
            state[index] = newVal;
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
          const index = state.findIndex(x => (0, _deepEqual2.default)(x.id, oldVal.id));
          if (index === -1) {
            // indicates a programming bug. The server gives us the
            // ordering, so if we don't find the id it means something is
            // buggy.
            throw new Error(`change couldn't be applied: ${JSON.stringify(change)}`);
          } else {
            state[index] = newVal;
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
      throw new Error(`unrecognized 'type' field from server ${JSON.stringify(change)}`);
  }
  return state;
}
//# sourceMappingURL=redux.js.map