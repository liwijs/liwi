'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _AbstractQuery = require('../store/AbstractQuery');

var _AbstractQuery2 = _interopRequireDefault(_AbstractQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let FindAndSubscribeComponent = (_temp = _class = class extends _react.Component {

  componentDidMount() {
    // console.log('FindAndSubscribe: did mount');
    const { query, action, dispatch } = this.props;
    this._subscribe = query.fetchAndSubscribe((err, result) => {
      if (err) {
        // eslint-disable-next-line no-undef, no-alert
        alert(`Unexpected error: ${err}`);
        return;
      }

      dispatch(action(result, true));
    });
  }

  componentWillUnmount() {
    // console.log('FindAndSubscribe: will unmount');
    if (this._subscribe) {
      this._subscribe.stop();
      delete this._subscribe;
    }
  }

  render() {
    return this.props.children;
  }
}, _class.propTypes = {
  dispatch: _react.PropTypes.func.isRequired,
  action: _react.PropTypes.func.isRequired,
  query: _react.PropTypes.instanceOf(_AbstractQuery2.default).isRequired,
  children: _react.PropTypes.node
}, _temp);
exports.default = FindAndSubscribeComponent;
//# sourceMappingURL=FindAndSubscribe.js.map