var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import { ReactNodeType as _ReactNodeType, ReactComponentType as _ReactComponentType } from 'alp-react-redux/types';
import AbstractQuery from '../store/AbstractQuery';

import t from 'flow-runtime';
var ReactNodeType = t.tdz(function () {
  return _ReactNodeType;
});
var ReactComponentType = t.tdz(function () {
  return _ReactComponentType;
});
var PropsType = t.type('PropsType', t.exactObject(t.property('name', t.string()), t.property('query', t.ref(AbstractQuery)), t.property('component', t.ref(ReactComponentType)), t.property('loadingComponent', t.nullable(t.ref(ReactComponentType)), true)));
var FindComponent = (_temp2 = _class = function (_Component) {
  _inherits(FindComponent, _Component);

  function FindComponent() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FindComponent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FindComponent.__proto__ || Object.getPrototypeOf(FindComponent)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      fetched: false,
      result: undefined
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(FindComponent, [{
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
      var _returnType = t.return(t.ref(ReactNodeType));

      if (!this.state.fetched) {
        return _returnType.assert(this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null);
      }

      return _returnType.assert(React.createElement(this.props.component, _defineProperty({}, this.props.name, this.state.result)));
    }
  }]);

  return FindComponent;
}(Component), _class.propTypes = t.propTypes(PropsType), _temp2);
export { FindComponent as default };
//# sourceMappingURL=Find.js.map