'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

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
    return _this;
  }

  var _proto = FindAndSubscribeComponent.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var query = this.props.query;
    this._subscribe = query.fetchAndSubscribe(function (err, changes) {
      if (err) {
        // eslint-disable-next-line no-alert
        alert("Unexpected error: " + err);
        return;
      }

      var newResult = applyChanges(_this2.state.result, changes, '_id' // TODO get keyPath from client(/store)
      );

      if (!_this2.state.fetched) {
        _this2.setState({
          fetched: true,
          result: newResult
        });
      } else if (newResult !== _this2.state.result) {
        _this2.setState({
          result: newResult
        });
      }
    });
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this._subscribe) {
      this._subscribe.stop();

      delete this._subscribe;
    }
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

exports.Find = FindComponent;
exports.FindAndSubscribe = FindAndSubscribeComponent;
//# sourceMappingURL=index-browser-dev.cjs.js.map
