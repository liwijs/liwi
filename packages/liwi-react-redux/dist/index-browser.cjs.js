'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var deepEqual = _interopDefault(require('deep-equal'));

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var FindComponent = function (_Component) {
  inherits(FindComponent, _Component);

  function FindComponent() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, FindComponent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = FindComponent.__proto__ || Object.getPrototypeOf(FindComponent)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      fetched: false,
      result: undefined
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(FindComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
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
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._find) {
        // this._find.cancel();
        delete this._find;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.state.fetched) {
        return this.props.loadingComponent ? React__default.createElement(this.props.loadingComponent) : null;
      }

      return React__default.createElement(this.props.component, defineProperty({}, this.props.name, this.state.result));
    }
  }]);
  return FindComponent;
}(React.Component);

// https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js
var applyChange = (function (state, change) {
  var type = change.type,
      oldOffset = change.old_offset,
      newOffset = change.new_offset,
      oldVal = change.old_val,
      newVal = change.new_val;


  var copy = function copy() {
    state = state.slice();
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
});

var FindAndSubscribeComponent = function (_Component) {
  inherits(FindAndSubscribeComponent, _Component);

  function FindAndSubscribeComponent() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, FindAndSubscribeComponent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = FindAndSubscribeComponent.__proto__ || Object.getPrototypeOf(FindAndSubscribeComponent)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      fetched: false,
      result: []
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(FindAndSubscribeComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var query = this.props.query;

      this._subscribe = query.fetchAndSubscribe(function (err, change) {
        if (err) {
          // eslint-disable-next-line no-alert
          alert('Unexpected error: ' + err);
          return;
        }

        var newResult = applyChange(_this2.state.result, change);

        if (!_this2.state.fetched) {
          _this2.setState({ fetched: true, result: newResult });
        } else if (newResult !== _this2.state.result) {
          _this2.setState({ result: newResult });
        }
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._subscribe) {
        this._subscribe.stop();
        delete this._subscribe;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.state.fetched) {
        return this.props.loadingComponent ? React__default.createElement(this.props.loadingComponent) : null;
      }

      return React__default.createElement(this.props.component, defineProperty({}, this.props.name, this.state.result));
    }
  }]);
  return FindAndSubscribeComponent;
}(React.Component);

exports.Find = FindComponent;
exports.FindAndSubscribe = FindAndSubscribeComponent;
//# sourceMappingURL=index-browser.cjs.js.map
