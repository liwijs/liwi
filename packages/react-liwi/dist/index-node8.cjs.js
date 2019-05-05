'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const React = require('react');
const React__default = _interopDefault(React);
const Logger = _interopDefault(require('nightingale-logger'));

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
        return [...change.objects, ...state.slice(0, -change.objects.length)];
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


const applyChanges = ((state, changes, keyPath) => {
  if (changes.length === 1) {
    const firstChange = changes[0];

    if (firstChange.type === 'initial') {
      return firstChange.initial;
    }
  }

  if (state === undefined) return state;
  return changes.reduce((stateValue, change) => applyChange(stateValue, change, keyPath), state);
});

const logger = new Logger('react-liwi:FindAndSubscribe');
class FindAndSubscribeComponent extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      fetched: false,
      result: undefined
    };
    this.timeout = undefined;
    this._subscribe = undefined;

    this.handleVisibilityChange = () => {
      if (!document.hidden) {
        if (this.timeout !== undefined) {
          logger.info('timeout cleared', {
            name: this.props.name
          });
          clearTimeout(this.timeout);
          this.timeout = undefined;
        } else {
          logger.info('resubscribe', {
            name: this.props.name
          });
          this.subscribe(this.query);
        }

        return;
      }

      if (this._subscribe === undefined) return;
      logger.log('timeout visible', {
        name: this.props.name
      });
      this.timeout = setTimeout(this.unsubscribe, this.props.visibleTimeout);
    };

    this.subscribe = query => {
      this._subscribe = query.fetchAndSubscribe((err, changes) => {
        if (err) {
          // eslint-disable-next-line no-alert
          alert(`Unexpected error: ${err}`);
          return;
        }

        const newResult = applyChanges(this.state.result, changes, '_id' // TODO get keyPath from client(/store)
        );

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
    };

    this.unsubscribe = () => {
      logger.log('unsubscribe due to timeout visible', {
        name: this.props.name
      }); // reset timeout to allow resubscribing

      this.timeout = undefined;

      if (this._subscribe) {
        this._subscribe.stop();

        this._subscribe = undefined;
      }
    };
  }

  componentDidMount() {
    this.query = this.props.createQuery(this.props.params);

    if (!document.hidden) {
      this.subscribe(this.query);
    }

    document.addEventListener('visibilitychange', this.handleVisibilityChange, false);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.unsubscribe();
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
FindAndSubscribeComponent.defaultProps = {
  visibleTimeout: 120000 // 2 minutes

};

/* eslint-disable import/export */
function useResources(createQueries, queriesToSubscribe) {
  return [true, []];
}

function useResource(createQuery, subscribe) {
  return [true, undefined];
}

exports.Find = FindComponent;
exports.FindAndSubscribe = FindAndSubscribeComponent;
exports.useResource = useResource;
exports.useResources = useResources;
//# sourceMappingURL=index-node8.cjs.js.map
