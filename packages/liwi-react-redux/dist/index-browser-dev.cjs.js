'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var FindComponent =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(FindComponent, _Component);

  function FindComponent() {
    var _this, _len, args, _key;

    for (_len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.state = {
      fetched: false,
      result: undefined
    };
    _this._find = void 0;
    return _this;
  }

  var _proto = FindComponent.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var query = this.props.query;
    this._find = query.fetch(function (result) {
      if (!_this2._find) return;

      _this2.setState({
        fetched: true,
        result: result
      });

      delete _this2._find;
    });
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this._find) {
      // this._find.cancel();
      delete this._find;
    }
  };

  _proto.render = function render() {
    var _React$createElement;

    if (!this.state.fetched) {
      return this.props.loadingComponent ? React__default.createElement(this.props.loadingComponent) : null;
    }

    return React__default.createElement(this.props.component, (_React$createElement = {}, _React$createElement[this.props.name] = this.state.result, _React$createElement));
  };

  return FindComponent;
}(React.Component);

// export { default as FindAndSubscribe } from './FindAndSubscribe';

exports.Find = FindComponent;
//# sourceMappingURL=index-browser-dev.cjs.js.map
