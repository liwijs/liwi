'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _AbstractQuery = require('../store/AbstractQuery');

var _AbstractQuery2 = _interopRequireDefault(_AbstractQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FindComponent extends _react.Component {

  componentDidMount() {
    var _props = this.props;
    const query = _props.query;
    const action = _props.action;
    const dispatch = _props.dispatch;

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
}
exports.default = FindComponent;
FindComponent.propTypes = {
  dispatch: _react.PropTypes.func.isRequired,
  action: _react.PropTypes.func.isRequired,
  query: _react.PropTypes.instanceOf(_AbstractQuery2.default).isRequired,
  children: _react.PropTypes.node
};
//# sourceMappingURL=Find.js.map