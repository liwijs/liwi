'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _types = require('alp-react-redux/types');

var _AbstractQuery2 = require('../store/AbstractQuery');

var _AbstractQuery3 = _interopRequireDefault(_AbstractQuery2);

var _applyChange = require('./applyChange');

var _applyChange2 = _interopRequireDefault(_applyChange);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AbstractQuery = _flowRuntime2.default.tdz(() => _AbstractQuery3.default);

const ReactNodeType = _flowRuntime2.default.tdz(() => _types.ReactNodeType);

const ReactComponentType = _flowRuntime2.default.tdz(() => _types.ReactComponentType);

const PropsType = _flowRuntime2.default.type('PropsType', _flowRuntime2.default.object(_flowRuntime2.default.property('name', _flowRuntime2.default.string()), _flowRuntime2.default.property('query', _flowRuntime2.default.ref(AbstractQuery)), _flowRuntime2.default.property('component', _flowRuntime2.default.ref(ReactComponentType)), _flowRuntime2.default.property('loadingComponent', _flowRuntime2.default.nullable(_flowRuntime2.default.ref(ReactComponentType)))));

let FindAndSubscribeComponent = (_temp2 = _class = class extends _react.Component {
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
    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref(ReactNodeType));

    return this.state.fetched ? _returnType.assert(_react2.default.createElement(this.props.component, { [this.props.name]: this.state.result })) : _returnType.assert(this.props.loadingComponent ? _react2.default.createElement(this.props.loadingComponent) : null);
  }
}, _class.propTypes = _flowRuntime2.default.propTypes(PropsType), _temp2);
exports.default = FindAndSubscribeComponent;
//# sourceMappingURL=FindAndSubscribe.js.map