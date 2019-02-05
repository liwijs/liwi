import React, { Component } from 'react';
import Logger from 'nightingale-logger';

class FindComponent extends Component {
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
      return this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null;
    }

    return React.createElement(this.props.component, {
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

const logger = new Logger('react-liwi:FindAndSubscribe');
class FindAndSubscribeComponent extends Component {
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
          logger.log('timeout cleared', {
            name: this.props.name
          });
          clearTimeout(this.timeout);
          this.timeout = undefined;
        } else {
          logger.debug('resubscribe', {
            name: this.props.name
          });
          this.subscribe();
        }

        return;
      }

      if (this._subscribe === undefined) return;
      logger.log('timeout visible', {
        name: this.props.name
      });
      this.timeout = setTimeout(this.unsubscribe, this.props.visibleTimeout);
    };

    this.subscribe = () => {
      const {
        query
      } = this.props;
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
  }

  componentDidMount() {
    this.subscribe();
    document.addEventListener('visibilitychange', this.handleVisibilityChange, false);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  unsubscribe() {
    if (this._subscribe) {
      this._subscribe.stop();

      this._subscribe = undefined;
    }
  }

  render() {
    if (!this.state.fetched) {
      return this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null;
    }

    return React.createElement(this.props.component, {
      [this.props.name]: this.state.result
    });
  }

}
FindAndSubscribeComponent.defaultProps = {
  visibleTimeout: 120000 // 2 minutes

};

export { FindComponent as Find, FindAndSubscribeComponent as FindAndSubscribe };
//# sourceMappingURL=index-node10.es.js.map
