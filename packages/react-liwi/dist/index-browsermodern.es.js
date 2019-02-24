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
    var _this = this;

    const {
      query
    } = this.props;
    this._find = query.fetch(function (result) {
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
    if (!this.state.fetched) {
      return this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null;
    }

    return React.createElement(this.props.component, {
      [this.props.name]: this.state.result
    });
  }

}

/* eslint-disable camelcase, complexity */
const copy = function copy(state) {
  return state.slice();
};

const applyChange = function applyChange(state, change, keyPath) {
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
        return state.filter(function (value) {
          return !deletedKeys.includes(value[keyPath]);
        });
      }

    case 'updated':
      {
        const newState = copy(state);
        change.objects.forEach(function (newObject) {
          const index = newState.findIndex(function (o) {
            return o[keyPath] === newObject[keyPath];
          });
          if (index === -1) return;
          newState[index] = newObject;
        });
        return newState;
      }

    default:
      throw new Error('Invalid type');
  }
}; // https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js


var applyChanges = (function (state, changes, keyPath) {
  if (changes.length === 1) {
    const firstChange = changes[0];

    if (firstChange.type === 'initial') {
      return firstChange.initial;
    }
  }

  if (state === undefined) return state;
  return changes.reduce(function (stateValue, change) {
    return applyChange(stateValue, change, keyPath);
  }, state);
});

const logger = new Logger('react-liwi:FindAndSubscribe');
class FindAndSubscribeComponent extends Component {
  constructor(...args) {
    var _this;

    super(...args);
    _this = this;
    this.state = {
      fetched: false,
      result: undefined
    };
    this.timeout = undefined;
    this._subscribe = undefined;

    this.handleVisibilityChange = function () {
      if (!document.hidden) {
        if (_this.timeout !== undefined) {
          logger.info('timeout cleared', {
            name: _this.props.name
          });
          clearTimeout(_this.timeout);
          _this.timeout = undefined;
        } else {
          logger.info('resubscribe', {
            name: _this.props.name
          });

          _this.subscribe(_this.query);
        }

        return;
      }

      if (_this._subscribe === undefined) return;
      logger.log('timeout visible', {
        name: _this.props.name
      });
      _this.timeout = setTimeout(_this.unsubscribe, _this.props.visibleTimeout);
    };

    this.subscribe = function (query) {
      _this._subscribe = query.fetchAndSubscribe(function (err, changes) {
        if (err) {
          // eslint-disable-next-line no-alert
          alert(`Unexpected error: ${err}`);
          return;
        }

        const newResult = applyChanges(_this.state.result, changes, '_id' // TODO get keyPath from client(/store)
        );

        if (!_this.state.fetched) {
          _this.setState({
            fetched: true,
            result: newResult
          });
        } else if (newResult !== _this.state.result) {
          _this.setState({
            result: newResult
          });
        }
      });
    };

    this.unsubscribe = function () {
      logger.log('unsubscribe due to timeout visible', {
        name: _this.props.name
      }); // reset timeout to allow resubscribing

      _this.timeout = undefined;

      if (_this._subscribe) {
        _this._subscribe.stop();

        _this._subscribe = undefined;
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
//# sourceMappingURL=index-browsermodern.es.js.map
