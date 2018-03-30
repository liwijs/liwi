import React, { Component, Node, ComponentType } from 'react';
import { AbstractQuery } from 'liwi-store';
import t from 'flow-runtime';
import deepEqual from 'deep-equal';

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

var _class, _temp2;
var Node$1 = t.tdz(function () {
  return Node;
});
var ComponentType$1 = t.tdz(function () {
  return ComponentType;
});
var PropsType = t.type('PropsType', t.exactObject(t.property('component', t.ref(ComponentType$1)), t.property('loadingComponent', t.nullable(t.ref(ComponentType$1)), true), t.property('name', t.string()), t.property('query', t.ref(AbstractQuery))));
var FindComponent = (_temp2 = _class = function (_Component) {
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
        var _resultType = t.any();

        t.param('result', _resultType).assert(result);

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
      var _returnType = t.return(t.ref(Node$1));

      if (!this.state.fetched) {
        return _returnType.assert(this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null);
      }

      return _returnType.assert(React.createElement(this.props.component, defineProperty({}, this.props.name, this.state.result)));
    }
  }]);
  return FindComponent;
}(Component), _class.propTypes = t.propTypes(PropsType), _temp2);

var ObjectArrayType = t.type('ObjectArrayType', t.array(t.object()));
var ChangeType = t.type('ChangeType', t.object(t.property('new_offset', t.nullable(t.number()), true), t.property('new_val', t.nullable(t.object()), true), t.property('old_offset', t.nullable(t.number()), true), t.property('old_val', t.nullable(t.object()), true), t.property('state', t.nullable(t.string()), true), t.property('type', t.string())));

// https://github.com/rethinkdb/horizon/blob/next/client/src/ast.js

var applyChange = (function (state, change) {
  var _stateType = ObjectArrayType;
  t.param('state', _stateType).assert(state);
  t.param('change', ChangeType).assert(change);
  var type = change.type,
      oldOffset = change.old_offset,
      newOffset = change.new_offset,
      oldVal = change.old_val,
      newVal = change.new_val;


  var copy = function copy() {
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

var _class$1, _temp;
var Node$2 = t.tdz(function () {
  return Node;
});
var ComponentType$2 = t.tdz(function () {
  return ComponentType;
});
var Props = t.type('Props', t.exactObject(t.property('component', t.ref(ComponentType$2)), t.property('loadingComponent', t.nullable(t.ref(ComponentType$2)), true), t.property('name', t.string()), t.property('query', t.ref(AbstractQuery))));
var State = t.type('State', t.exactObject(t.property('fetched', t.boolean()), t.property('result', t.array(t.any()))));
var FindAndSubscribeComponent = (_temp = _class$1 = function (_Component) {
  inherits(FindAndSubscribeComponent, _Component);

  function FindAndSubscribeComponent() {
    var _ref;

    classCallCheck(this, FindAndSubscribeComponent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = possibleConstructorReturn(this, (_ref = FindAndSubscribeComponent.__proto__ || Object.getPrototypeOf(FindAndSubscribeComponent)).call.apply(_ref, [this].concat(args)));

    _this.state = {
      fetched: false,
      result: []
    };
    t.bindTypeParameters(_this, Props, State);
    return _this;
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
      var _returnType = t.return(t.ref(Node$2));

      if (!this.state.fetched) {
        return _returnType.assert(this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null);
      }

      return _returnType.assert(React.createElement(this.props.component, defineProperty({}, this.props.name, this.state.result)));
    }
  }]);
  return FindAndSubscribeComponent;
}(Component), _class$1.propTypes = t.propTypes(Props), _temp);

export { FindComponent as Find, FindAndSubscribeComponent as FindAndSubscribe };
//# sourceMappingURL=index-browser-dev.es.js.map
