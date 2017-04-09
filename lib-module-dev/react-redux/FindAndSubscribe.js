var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { PropTypes, Component } from 'react';
import AbstractQuery from '../store/AbstractQuery';

var FindAndSubscribeComponent = (_temp = _class = function (_Component) {
  _inherits(FindAndSubscribeComponent, _Component);

  function FindAndSubscribeComponent() {
    _classCallCheck(this, FindAndSubscribeComponent);

    return _possibleConstructorReturn(this, (FindAndSubscribeComponent.__proto__ || Object.getPrototypeOf(FindAndSubscribeComponent)).apply(this, arguments));
  }

  _createClass(FindAndSubscribeComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // console.log('FindAndSubscribe: did mount');
      var _props = this.props,
          query = _props.query,
          action = _props.action,
          dispatch = _props.dispatch;

      this._subscribe = query.fetchAndSubscribe(function (err, result) {
        if (err) {
          // eslint-disable-next-line no-undef, no-alert
          alert('Unexpected error: ' + err);
          return;
        }

        dispatch(action(result, true));
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // console.log('FindAndSubscribe: will unmount');
      if (this._subscribe) {
        this._subscribe.stop();
        delete this._subscribe;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return FindAndSubscribeComponent;
}(Component), _class.propTypes = {
  dispatch: PropTypes.func.isRequired,
  action: PropTypes.func.isRequired,
  query: PropTypes.instanceOf(AbstractQuery).isRequired,
  children: PropTypes.node
}, _temp);
export { FindAndSubscribeComponent as default };
//# sourceMappingURL=FindAndSubscribe.js.map