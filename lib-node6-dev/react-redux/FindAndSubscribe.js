'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _AbstractQuery = require('../store/AbstractQuery');

var _AbstractQuery2 = _interopRequireDefault(_AbstractQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FindAndSubscribeComponent extends _react.Component {

  componentDidMount() {
    // console.log('FindAndSubscribe: did mount');
    var _props = this.props;
    const query = _props.query;
    const action = _props.action;
    const dispatch = _props.dispatch;

    this._subscribe = query.fetchAndSubscribe((err, result) => {
      if (err) {
        // eslint-disable-next-line no-undef, no-alert
        alert(`Unexpected error: ${ err }`);
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
}
exports.default = FindAndSubscribeComponent;
FindAndSubscribeComponent.propTypes = {
  dispatch: _react.PropTypes.func.isRequired,
  action: _react.PropTypes.func.isRequired,
  query: _react.PropTypes.instanceOf(_AbstractQuery2.default).isRequired,
  children: _react.PropTypes.node
};
//# sourceMappingURL=FindAndSubscribe.js.map