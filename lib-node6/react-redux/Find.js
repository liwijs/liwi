'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let FindComponent = (_temp = _class = class extends _react.Component {

  componentDidMount() {
    const { query, action } = this.props;
    const dispatch = this.props.dispatch || this.context.store.dispatch;
    this._find = query.fetch(result => {
      if (!this._find) return;
      dispatch(action(result));
      delete this._find;
    });
  }

  componentWillUnmount() {
    if (this._find) {
      // this._find.cancel();
      delete this._find;
    }
  }

  render() {
    return this.props.children;
  }
}, _class.contextTypes = {
  store: _propTypes2.default.any
}, _temp);
exports.default = FindComponent;
//# sourceMappingURL=Find.js.map