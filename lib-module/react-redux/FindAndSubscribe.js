var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';

import applyChange from './applyChange';

var FindAndSubscribeComponent = function (_Component) {
  _inherits(FindAndSubscribeComponent, _Component);

  function FindAndSubscribeComponent() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FindAndSubscribeComponent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FindAndSubscribeComponent.__proto__ || Object.getPrototypeOf(FindAndSubscribeComponent)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      fetched: false,
      result: []
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(FindAndSubscribeComponent, [{
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
        return this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null;
      }

      return React.createElement(this.props.component, _defineProperty({}, this.props.name, this.state.result));
    }
  }]);

  return FindAndSubscribeComponent;
}(Component);

export { FindAndSubscribeComponent as default };
//# sourceMappingURL=FindAndSubscribe.js.map