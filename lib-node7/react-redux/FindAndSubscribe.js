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

let FindAndSubscribeComponent = (_temp = _class = class extends _react.Component {

  componentDidMount() {
    const { query, action } = this.props;
    const dispatch = this.props.dispatch || this.context.store.dispatch;
    this._subscribe = query.fetchAndSubscribe((err, result) => {
      if (err) {
        // eslint-disable-next-line no-alert
        alert(`Unexpected error: ${err}`);
        return;
      }

      dispatch(action(result, true));
    });
  }

  componentWillUnmount() {
    if (this._subscribe) {
      this._subscribe.stop();
      delete this._subscribe;
    }
  }

  render() {
    return this.props.children;
  }
}, _class.contextTypes = {
  store: _propTypes2.default.any
}, _temp);
exports.default = FindAndSubscribeComponent;
//# sourceMappingURL=FindAndSubscribe.js.map