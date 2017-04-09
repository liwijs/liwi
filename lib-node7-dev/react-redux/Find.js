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

let FindComponent = (_temp = _class = class extends _react.Component {

  componentDidMount() {
    const { query, action, dispatch } = this.props;
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
}, _class.propTypes = {
  dispatch: _react.PropTypes.func.isRequired,
  action: _react.PropTypes.func.isRequired,
  query: _react.PropTypes.instanceOf(_AbstractQuery2.default).isRequired,
  children: _react.PropTypes.node
}, _temp);
exports.default = FindComponent;
//# sourceMappingURL=Find.js.map