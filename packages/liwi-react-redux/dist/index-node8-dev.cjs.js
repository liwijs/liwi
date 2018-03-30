'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var liwiStore = require('liwi-store');
var t = _interopDefault(require('flow-runtime'));
var deepEqual = _interopDefault(require('deep-equal'));

var _class, _temp2;
const Node = t.tdz(() => React.Node);
const ComponentType = t.tdz(() => React.ComponentType);
const PropsType = t.type('PropsType', t.exactObject(t.property('component', t.ref(ComponentType)), t.property('loadingComponent', t.nullable(t.ref(ComponentType)), true), t.property('name', t.string()), t.property('query', t.ref(liwiStore.AbstractQuery))));
let FindComponent = (_temp2 = _class = class extends React.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = {
      fetched: false,
      result: undefined
    }, _temp;
  }

  componentDidMount() {
    const { query } = this.props;
    this._find = query.fetch(result => {
      let _resultType = t.any();

      t.param('result', _resultType).assert(result);

      if (!this._find) return;
      this.setState({
        fetched: true,
        result
      });
      delete this._find;
    });
  }

  componentWillUnmount() {
    if (this._find) {
      // this._find.cancel();
      delete this._find;
    }
  }

  render() {
    const _returnType = t.return(t.ref(Node));

    if (!this.state.fetched) {
      return _returnType.assert(this.props.loadingComponent ? React__default.createElement(this.props.loadingComponent) : null);
    }

    return _returnType.assert(React__default.createElement(this.props.component, { [this.props.name]: this.state.result }));
  }
}, _class.propTypes = t.propTypes(PropsType), _temp2);

const ObjectArrayType = t.type('ObjectArrayType', t.array(t.object()));
const ChangeType = t.type('ChangeType', t.object(t.property('new_offset', t.nullable(t.number()), true), t.property('new_val', t.nullable(t.object()), true), t.property('old_offset', t.nullable(t.number()), true), t.property('old_val', t.nullable(t.object()), true), t.property('state', t.nullable(t.string()), true), t.property('type', t.string())));

// https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js

var applyChange = ((state, change) => {
  let _stateType = ObjectArrayType;
  t.param('state', _stateType).assert(state);
  t.param('change', ChangeType).assert(change);

  const {
    type,
    old_offset: oldOffset,
    new_offset: newOffset,
    old_val: oldVal,
    new_val: newVal
  } = change;

  const copy = () => {
    state = _stateType.assert(state.slice());
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
          const index = state.findIndex(x => deepEqual(x.id, oldVal.id));
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
          const index = state.findIndex(x => deepEqual(x.id, newVal.id));
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
          const index = state.findIndex(x => deepEqual(x.id, oldVal.id));
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
});

var _class$1, _temp;
const Node$1 = t.tdz(() => React.Node);
const ComponentType$1 = t.tdz(() => React.ComponentType);
const Props = t.type('Props', t.exactObject(t.property('component', t.ref(ComponentType$1)), t.property('loadingComponent', t.nullable(t.ref(ComponentType$1)), true), t.property('name', t.string()), t.property('query', t.ref(liwiStore.AbstractQuery))));
const State = t.type('State', t.exactObject(t.property('fetched', t.boolean()), t.property('result', t.array(t.any()))));
let FindAndSubscribeComponent = (_temp = _class$1 = class extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      fetched: false,
      result: []
    };
    t.bindTypeParameters(this, Props, State);
  }

  componentDidMount() {
    const { query } = this.props;
    this._subscribe = query.fetchAndSubscribe((err, change) => {
      if (err) {
        // eslint-disable-next-line no-alert
        alert(`Unexpected error: ${err}`);
        return;
      }

      const newResult = applyChange(this.state.result, change);

      if (!this.state.fetched) {
        this.setState({ fetched: true, result: newResult });
      } else if (newResult !== this.state.result) {
        this.setState({ result: newResult });
      }
    });
  }

  componentWillUnmount() {
    if (this._subscribe) {
      this._subscribe.stop();
      delete this._subscribe;
    }
  }

  render() {
    const _returnType = t.return(t.ref(Node$1));

    if (!this.state.fetched) {
      return _returnType.assert(this.props.loadingComponent ? React__default.createElement(this.props.loadingComponent) : null);
    }

    return _returnType.assert(React__default.createElement(this.props.component, { [this.props.name]: this.state.result }));
  }
}, _class$1.propTypes = t.propTypes(Props), _temp);

exports.Find = FindComponent;
exports.FindAndSubscribe = FindAndSubscribeComponent;
//# sourceMappingURL=index-node8-dev.cjs.js.map
