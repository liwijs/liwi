'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _types = require('alp-react-redux/types');

var _AbstractQuery = require('../store/AbstractQuery');

var _AbstractQuery2 = _interopRequireDefault(_AbstractQuery);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ReactNodeType = _flowRuntime2.default.tdz(() => _types.ReactNodeType);

const ReactComponentType = _flowRuntime2.default.tdz(() => _types.ReactComponentType);

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.exactObject(_flowRuntime2.default.property('name', _flowRuntime2.default.string()), _flowRuntime2.default.property('query', _flowRuntime2.default.ref(_AbstractQuery2.default)), _flowRuntime2.default.property('component', _flowRuntime2.default.ref(ReactComponentType)), _flowRuntime2.default.property('loadingComponent', _flowRuntime2.default.nullable(_flowRuntime2.default.ref(ReactComponentType)), true)));

let FindComponent = (_temp2 = _class = class extends _react.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = {
      fetched: false,
      result: undefined
    }, _temp;
  }

  componentDidMount() {
    const { query } = this.props;
    this._find = query.fetch(result => {
      let _resultType = _flowRuntime2.default.any();

      _flowRuntime2.default.param('result', _resultType).assert(result);

      if (!this._find) return;
      this.setState({
        fetched: true,
        result
      });
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
    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(ReactNodeType));

    if (!this.state.fetched) {
      return _returnType.assert(this.props.loadingComponent ? _react2.default.createElement(this.props.loadingComponent) : null);
    }

    return _returnType.assert(_react2.default.createElement(this.props.component, { [this.props.name]: this.state.result }));
  }
}, _class.propTypes = _flowRuntime2.default.propTypes(PropsType), _temp2);
exports.default = FindComponent;
//# sourceMappingURL=Find.js.map