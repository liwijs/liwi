'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var Logger = _interopDefault(require('nightingale-logger'));

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var FindComponent =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(FindComponent, _Component);

  function FindComponent() {
    var _this, _len, args, _key;

    for (_len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.state = {
      fetched: false,
      result: undefined
    };
    return _this;
  }

  var _proto = FindComponent.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var query = this.props.query;
    this._find = query.fetch(function (result) {
      if (!_this2._find) return;

      _this2.setState({
        fetched: true,
        result: result
      });

      delete _this2._find;
    });
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this._find) {
      // this._find.cancel();
      delete this._find;
    }
  };

  _proto.render = function render() {
    var _React$createElement;

    if (!this.state.fetched) {
      return this.props.loadingComponent ? React__default.createElement(this.props.loadingComponent) : null;
    }

    return React__default.createElement(this.props.component, (_React$createElement = {}, _React$createElement[this.props.name] = this.state.result, _React$createElement));
  };

  return FindComponent;
}(React.Component);

/* eslint-disable camelcase, complexity */
var copy = function copy(state) {
  return state.slice();
};

var applyChange = function applyChange(state, change, keyPath) {
  switch (change.type) {
    case 'initial':
      return change.initial;

    case 'inserted':
      {
        return [].concat(change.objects, state.slice(0, -change.objects.length));
      }

    case 'deleted':
      {
        var deletedKeys = change.keys;
        return state.filter(function (value) {
          return !deletedKeys.includes(value[keyPath]);
        });
      }

    case 'updated':
      {
        var newState = copy(state);
        change.objects.forEach(function (newObject) {
          var index = newState.findIndex(function (o) {
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
    var firstChange = changes[0];

    if (firstChange.type === 'initial') {
      return firstChange.initial;
    }
  }

  if (state === undefined) return state;
  return changes.reduce(function (stateValue, change) {
    return applyChange(stateValue, change, keyPath);
  }, state);
});

var logger = new Logger('react-liwi:FindAndSubscribe');

var FindAndSubscribeComponent =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(FindAndSubscribeComponent, _Component);

  function FindAndSubscribeComponent() {
    var _this, _len, args, _key;

    for (_len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.state = {
      fetched: false,
      result: undefined
    };
    _this.timeout = undefined;
    _this._subscribe = undefined;

    _this.handleVisibilityChange = function () {
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

    _this.subscribe = function (query) {
      _this._subscribe = query.fetchAndSubscribe(function (err, changes) {
        if (err) {
          // eslint-disable-next-line no-alert
          alert("Unexpected error: " + err);
          return;
        }

        var newResult = applyChanges(_this.state.result, changes, '_id' // TODO get keyPath from client(/store)
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

    _this.unsubscribe = function () {
      logger.log('unsubscribe due to timeout visible', {
        name: _this.props.name
      }); // reset timeout to allow resubscribing

      _this.timeout = undefined;

      if (_this._subscribe) {
        _this._subscribe.stop();

        _this._subscribe = undefined;
      }
    };

    return _this;
  }

  var _proto = FindAndSubscribeComponent.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.query = this.props.createQuery(this.props.params);

    if (!document.hidden) {
      this.subscribe(this.query);
    }

    document.addEventListener('visibilitychange', this.handleVisibilityChange, false);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.unsubscribe();
  };

  _proto.render = function render() {
    var _React$createElement;

    if (!this.state.fetched) {
      return this.props.loadingComponent ? React__default.createElement(this.props.loadingComponent) : null;
    }

    return React__default.createElement(this.props.component, (_React$createElement = {}, _React$createElement[this.props.name] = this.state.result, _React$createElement));
  };

  return FindAndSubscribeComponent;
}(React.Component);

FindAndSubscribeComponent.defaultProps = {
  visibleTimeout: 120000 // 2 minutes

};

function initReducer(initializer) {
  return {
    fetched: false,
    promise: initializer()
  };
}
function reducer(state, action) {
  switch (action.type) {
    case 'resolve':
      return {
        fetched: true,
        result: action.result
      };

    default:
      throw new Error('Invalid action');
  }
}

function useRetrieveResource(createQuery) {
  var _useReducer = React.useReducer(reducer, function () {
    return createQuery().fetch(function (result) {
      state.resolve();
      dispatch({
        type: 'resolve',
        result: result
      });
    });
  }, initReducer),
      state = _useReducer[0],
      dispatch = _useReducer[1];

  return state;
}

var defaultOptions = {
  visibleTimeout: 120000 // 2 minutes

};
var logger$1 = new Logger('react-liwi:useResourceAndSubscribe');
function useRetrieveResourceAndSubscribe(createQuery, _temp) {
  var _ref = _temp === void 0 ? defaultOptions : _temp,
      visibleTimeout = _ref.visibleTimeout;

  var subscribeResultRef = React.useRef(undefined);
  var timeoutRef = React.useRef(undefined);

  var unsubscribe = function unsubscribe() {
    logger$1.log('unsubscribe'); // reset timeout to allow resubscribing

    timeoutRef.current = undefined;

    if (subscribeResultRef.current) {
      subscribeResultRef.current.stop();
      subscribeResultRef.current = undefined;
    }
  };

  var _useReducer = React.useReducer(reducer, function () {
    return new Promise(function () {
      var query = createQuery();
      logger$1.log('init', {
        resourceName: query.client.resourceName,
        key: query.key
      });

      var subscribe = function subscribe() {
        logger$1.log('subscribing', {
          subscribeResultRef: subscribeResultRef.current,
          timeoutRef: timeoutRef.current
        });
        subscribeResultRef.current = query.fetchAndSubscribe(function (err, changes) {
          if (err) {
            // eslint-disable-next-line no-alert
            alert("Unexpected error: " + err);
            return;
          }

          var newResult = applyChanges(state.fetched ? state.result : undefined, changes, '_id' // TODO get keyPath from client(/store)
          );

          if (newResult && (!state.fetched || newResult !== state.result)) {
            dispatch({
              type: 'resolve',
              result: newResult
            });
          }
        });
      };

      document.addEventListener('visibilitychange', function handleVisibilityChange() {
        if (!document.hidden) {
          if (timeoutRef.current !== undefined) {
            logger$1.info('timeout cleared');
            clearTimeout(timeoutRef.current);
            timeoutRef.current = undefined;
          } else if (!subscribeResultRef.current) {
            logger$1.info('resubscribe');
            subscribe();
          }

          return;
        }

        if (subscribeResultRef.current === undefined) return;
        logger$1.log('timeout visible');
        timeoutRef.current = setTimeout(unsubscribe, visibleTimeout);
      }, false);

      if (!document.hidden) {
        subscribe();
      }
    });
  }, initReducer),
      state = _useReducer[0],
      dispatch = _useReducer[1];

  React.useEffect(function () {
    return function () {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }

      unsubscribe();
    };
  }, []);
  return state;
}

/* eslint-disable import/export */
function useResources(createQueries, queriesToSubscribe) {
  var states = createQueries.map(function (createQuery, index) {
    return queriesToSubscribe[index] ? // eslint-disable-next-line react-hooks/rules-of-hooks
    useRetrieveResourceAndSubscribe(createQuery) : // eslint-disable-next-line react-hooks/rules-of-hooks
    useRetrieveResource(createQuery);
  });
  var nonFetchedStates = states.filter(function (state) {
    return !state.fetched;
  });

  if (nonFetchedStates.length !== 0) {
    return [true, []];
  }

  return [false, states.map(function (state) {
    return state.result;
  })];
}

function useResource(createQuery, subscribe) {
  var state = subscribe ? // eslint-disable-next-line react-hooks/rules-of-hooks
  useRetrieveResourceAndSubscribe(createQuery) : // eslint-disable-next-line react-hooks/rules-of-hooks
  useRetrieveResource(createQuery);

  if (!state.fetched) {
    return [true, undefined];
  }

  return [false, state.result];
}

exports.Find = FindComponent;
exports.FindAndSubscribe = FindAndSubscribeComponent;
exports.useResources = useResources;
exports.useResource = useResource;
//# sourceMappingURL=index-browser-dev.cjs.js.map
