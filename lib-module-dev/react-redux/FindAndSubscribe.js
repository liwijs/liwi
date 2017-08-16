var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

var _class, _temp2;

function _defineProperty(obj, key, value) { return key in obj ? Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) : obj[key] = value, obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _possibleConstructorReturn(self, call) { if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass); }

import React, { Component } from 'react';
import { ReactNodeType as _ReactNodeType, ReactComponentType as _ReactComponentType } from 'alp-react-redux/types';
import _AbstractQuery from '../store/AbstractQuery';
import applyChange from './applyChange';

import t from 'flow-runtime';
var AbstractQuery = t.tdz(function () {
  return _AbstractQuery;
});
var ReactNodeType = t.tdz(function () {
  return _ReactNodeType;
});
var ReactComponentType = t.tdz(function () {
  return _ReactComponentType;
});
var PropsType = t.type('PropsType', t.object(t.property('name', t.string()), t.property('query', t.ref(AbstractQuery)), t.property('component', t.ref(ReactComponentType)), t.property('loadingComponent', t.nullable(t.ref(ReactComponentType)))));
var FindAndSubscribeComponent = (_temp2 = _class = function (_Component) {
  function FindAndSubscribeComponent() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FindAndSubscribeComponent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FindAndSubscribeComponent.__proto__ || Object.getPrototypeOf(FindAndSubscribeComponent)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      fetched: false,
      result: []
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return _inherits(FindAndSubscribeComponent, _Component), _createClass(FindAndSubscribeComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var query = this.props.query;
      this._subscribe = query.fetchAndSubscribe(function (err, change) {
        if (err) return void alert('Unexpected error: ' + err);

        var newResult = applyChange(_this2.state.result, change);

        _this2.state.fetched ? newResult !== _this2.state.result && _this2.setState({ result: newResult }) : _this2.setState({ fetched: true, result: newResult });
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._subscribe && (this._subscribe.stop(), delete this._subscribe);
    }
  }, {
    key: 'render',
    value: function render() {
      var _returnType = t.return(t.ref(ReactNodeType));

      return this.state.fetched ? _returnType.assert(React.createElement(this.props.component, _defineProperty({}, this.props.name, this.state.result))) : _returnType.assert(this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null);
    }
  }]), FindAndSubscribeComponent;
}(Component), _class.propTypes = t.propTypes(PropsType), _temp2);
export { FindAndSubscribeComponent as default };
//# sourceMappingURL=FindAndSubscribe.js.map