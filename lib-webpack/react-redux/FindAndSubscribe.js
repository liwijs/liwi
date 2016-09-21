var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { PropTypes, Component } from 'react';
import AbstractQuery from '../store/AbstractQuery';

var FindAndSubscribeComponent = function (_Component) {
  _inherits(FindAndSubscribeComponent, _Component);

  function FindAndSubscribeComponent() {
    _classCallCheck(this, FindAndSubscribeComponent);

    return _possibleConstructorReturn(this, (FindAndSubscribeComponent.__proto__ || Object.getPrototypeOf(FindAndSubscribeComponent)).apply(this, arguments));
  }

  _createClass(FindAndSubscribeComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props;
      var query = _props.query;
      var action = _props.action;
      var dispatch = _props.dispatch;

      this._find = query.fetch(function (result) {
        if (!_this2._find) return;
        dispatch(action(result));
        delete _this2._find;
      });
      this._subscribe = query.subscribe(function (result) {
        return dispatch(action(result, true));
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._find) {
        // this._find.cancel();
        delete this._find;
      }
      if (this._subscribe) {
        this._subscribe.stop();
        delete this._subscribe;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      throw new Error('Will be implemented next minor');
      return this.props.children;
    }
  }]);

  return FindAndSubscribeComponent;
}(Component);

FindAndSubscribeComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  action: PropTypes.func.isRequired,
  query: PropTypes.instanceOf(AbstractQuery).isRequired,
  children: PropTypes.node
};
export default FindAndSubscribeComponent;
//# sourceMappingURL=FindAndSubscribe.js.map