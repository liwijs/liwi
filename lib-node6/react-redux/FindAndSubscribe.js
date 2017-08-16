'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _applyChange = require('./applyChange');

var _applyChange2 = _interopRequireDefault(_applyChange);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let FindAndSubscribeComponent = class extends _react.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = {
      fetched: false,
      result: []
    }, _temp;
  }

  componentDidMount() {
    const { query } = this.props;
    this._subscribe = query.fetchAndSubscribe((err, change) => {
      if (err) return void alert(`Unexpected error: ${err}`);

      const newResult = (0, _applyChange2.default)(this.state.result, change);

      this.state.fetched ? newResult !== this.state.result && this.setState({ result: newResult }) : this.setState({ fetched: true, result: newResult });
    });
  }

  componentWillUnmount() {
    this._subscribe && (this._subscribe.stop(), delete this._subscribe);
  }

  render() {
    return this.state.fetched ? _react2.default.createElement(this.props.component, { [this.props.name]: this.state.result }) : this.props.loadingComponent ? _react2.default.createElement(this.props.loadingComponent) : null;
  }
};
exports.default = FindAndSubscribeComponent;
//# sourceMappingURL=FindAndSubscribe.js.map