var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

function _defineProperty(obj, key, value) { return key in obj ? Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) : obj[key] = value, obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _possibleConstructorReturn(self, call) { if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass); }

import React, { Component } from 'react';

var FindComponent = function (_Component) {
  function FindComponent() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FindComponent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FindComponent.__proto__ || Object.getPrototypeOf(FindComponent)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      fetched: false,
      result: void 0
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return _inherits(FindComponent, _Component), _createClass(FindComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var query = this.props.query;
      this._find = query.fetch(function (result) {
        _this2._find && (_this2.setState({
          fetched: true,
          result: result
        }), delete _this2._find);
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._find && delete this._find;
    }
  }, {
    key: 'render',
    value: function render() {
      return this.state.fetched ? React.createElement(this.props.component, _defineProperty({}, this.props.name, this.state.result)) : this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null;
    }
  }]), FindComponent;
}(Component);

export { FindComponent as default };
//# sourceMappingURL=Find.js.map