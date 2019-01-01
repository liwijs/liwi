'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

class FindComponent extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      fetched: false,
      result: undefined
    };
  }

  componentDidMount() {
    const {
      query
    } = this.props;
    this._find = query.fetch(result => {
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
    if (!this.state.fetched) {
      return this.props.loadingComponent ? React__default.createElement(this.props.loadingComponent) : null;
    }

    return React__default.createElement(this.props.component, {
      [this.props.name]: this.state.result
    });
  }

}

/* eslint-disable camelcase, complexity */
const copy = state => state.slice();

const applyChange = (state, change, keyPath) => {
  switch (change.type) {
    case 'initial':
      return change.initial;

    case 'inserted':
      {
        const newState = copy(state);
        newState.push(...change.objects);
        return newState;
      }

    case 'deleted':
      {
        const deletedKeys = change.keys;
        return state.filter(value => !deletedKeys.includes(value[keyPath]));
      }

    case 'updated':
      {
        const newState = copy(state);
        change.objects.forEach(newObject => {
          const index = newState.findIndex(o => o[keyPath] === newObject[keyPath]);
          if (index === -1) return;
          newState[index] = newObject;
        });
        return newState;
      }

    default:
      throw new Error('Invalid type');
  }
}; // https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js


var applyChanges = ((state, changes, keyPath) => {
  if (changes.length === 1) {
    const firstChange = changes[0];

    if (firstChange.type === 'initial') {
      return firstChange.initial;
    }
  }

  if (state === undefined) return state;
  return changes.reduce((stateValue, change) => applyChange(stateValue, change, keyPath), state);
});

class FindAndSubscribeComponent extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      fetched: false,
      result: undefined
    };
  }

  componentDidMount() {
    const {
      query
    } = this.props;
    this._subscribe = query.fetchAndSubscribe((err, changes) => {
      if (err) {
        // eslint-disable-next-line no-alert
        alert(`Unexpected error: ${err}`);
        return;
      }

      const newResult = applyChanges(this.state.result, changes, query.store.keyPath);

      if (!this.state.fetched) {
        this.setState({
          fetched: true,
          result: newResult
        });
      } else if (newResult !== this.state.result) {
        this.setState({
          result: newResult
        });
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
    if (!this.state.fetched) {
      return this.props.loadingComponent ? React__default.createElement(this.props.loadingComponent) : null;
    }

    return React__default.createElement(this.props.component, {
      [this.props.name]: this.state.result
    });
  }

}

exports.Find = FindComponent;
exports.FindAndSubscribe = FindAndSubscribeComponent;
//# sourceMappingURL=index-node8.cjs.js.map