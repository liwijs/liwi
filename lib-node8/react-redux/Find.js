'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let FindComponent = class extends _react.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = {
      fetched: false,
      result: void 0
    }, _temp;
  }

  componentDidMount() {
    const { query } = this.props;
    this._find = query.fetch(result => {
      this._find && (this.setState({
        fetched: true,
        result
      }), delete this._find);
    });
  }

  componentWillUnmount() {
    this._find && delete this._find;
  }

  render() {
    return this.state.fetched ? _react2.default.createElement(this.props.component, { [this.props.name]: this.state.result }) : this.props.loadingComponent ? _react2.default.createElement(this.props.loadingComponent) : null;
  }
};
exports.default = FindComponent;
//# sourceMappingURL=Find.js.map