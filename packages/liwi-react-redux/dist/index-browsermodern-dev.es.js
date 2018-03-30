import React, { Component, Node, ComponentType } from 'react';
import { AbstractQuery } from 'liwi-store';
import t from 'flow-runtime';
import deepEqual from 'deep-equal';

var _class, _temp2;
const Node$1 = t.tdz(function () {
  return Node;
});
const ComponentType$1 = t.tdz(function () {
  return ComponentType;
});
const PropsType = t.type('PropsType', t.exactObject(t.property('component', t.ref(ComponentType$1)), t.property('loadingComponent', t.nullable(t.ref(ComponentType$1)), true), t.property('name', t.string()), t.property('query', t.ref(AbstractQuery))));
let FindComponent = (_temp2 = _class = class extends Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = {
      fetched: false,
      result: undefined
    }, _temp;
  }

  componentDidMount() {
    var _this = this;

    const { query } = this.props;
    this._find = query.fetch(function (result) {
      let _resultType = t.any();

      t.param('result', _resultType).assert(result);

      if (!_this._find) return;
      _this.setState({
        fetched: true,
        result
      });
      delete _this._find;
    });
  }

  componentWillUnmount() {
    if (this._find) {
      // this._find.cancel();
      delete this._find;
    }
  }

  render() {
    const _returnType = t.return(t.ref(Node$1));

    if (!this.state.fetched) {
      return _returnType.assert(this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null);
    }

    return _returnType.assert(React.createElement(this.props.component, { [this.props.name]: this.state.result }));
  }
}, _class.propTypes = t.propTypes(PropsType), _temp2);

const ObjectArrayType = t.type('ObjectArrayType', t.array(t.object()));
const ChangeType = t.type('ChangeType', t.object(t.property('new_offset', t.nullable(t.number()), true), t.property('new_val', t.nullable(t.object()), true), t.property('old_offset', t.nullable(t.number()), true), t.property('old_val', t.nullable(t.object()), true), t.property('state', t.nullable(t.string()), true), t.property('type', t.string())));

// https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js

var applyChange = (function (state, change) {
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

  const copy = function copy() {
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
          const index = state.findIndex(function (x) {
            return deepEqual(x.id, oldVal.id);
          });
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
          const index = state.findIndex(function (x) {
            return deepEqual(x.id, newVal.id);
          });
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
          const index = state.findIndex(function (x) {
            return deepEqual(x.id, oldVal.id);
          });
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
const Node$2 = t.tdz(function () {
  return Node;
});
const ComponentType$2 = t.tdz(function () {
  return ComponentType;
});
const Props = t.type('Props', t.exactObject(t.property('component', t.ref(ComponentType$2)), t.property('loadingComponent', t.nullable(t.ref(ComponentType$2)), true), t.property('name', t.string()), t.property('query', t.ref(AbstractQuery))));
const State = t.type('State', t.exactObject(t.property('fetched', t.boolean()), t.property('result', t.array(t.any()))));
let FindAndSubscribeComponent = (_temp = _class$1 = class extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      fetched: false,
      result: []
    };
    t.bindTypeParameters(this, Props, State);
  }

  componentDidMount() {
    var _this = this;

    const { query } = this.props;
    this._subscribe = query.fetchAndSubscribe(function (err, change) {
      if (err) {
        // eslint-disable-next-line no-alert
        alert(`Unexpected error: ${err}`);
        return;
      }

      const newResult = applyChange(_this.state.result, change);

      if (!_this.state.fetched) {
        _this.setState({ fetched: true, result: newResult });
      } else if (newResult !== _this.state.result) {
        _this.setState({ result: newResult });
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
    const _returnType = t.return(t.ref(Node$2));

    if (!this.state.fetched) {
      return _returnType.assert(this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null);
    }

    return _returnType.assert(React.createElement(this.props.component, { [this.props.name]: this.state.result }));
  }
}, _class$1.propTypes = t.propTypes(Props), _temp);

export { FindComponent as Find, FindAndSubscribeComponent as FindAndSubscribe };
//# sourceMappingURL=index-browsermodern-dev.es.js.map
