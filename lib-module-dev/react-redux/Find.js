var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class, _descriptor, _class2, _temp2;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['keys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['defineProperty'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper() {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import React, { Component } from 'react';
import { ReactNodeType as _ReactNodeType, ReactComponentType as _ReactComponentType } from 'alp-react-redux/types';
import AbstractQuery from '../store/AbstractQuery';

import t from 'flow-runtime';
var ReactNodeType = t.tdz(function () {
  return _ReactNodeType;
});
var ReactComponentType = t.tdz(function () {
  return _ReactComponentType;
});
var PropsType = t.type('PropsType', t.object(t.property('name', t.string()), t.property('query', t.ref(AbstractQuery)), t.property('component', t.ref(ReactComponentType)), t.property('loadingComponent', t.nullable(t.ref(ReactComponentType)))));
var FindComponent = (_dec = t.decorate(PropsType), (_class = (_temp2 = _class2 = function (_Component) {
  _inherits(FindComponent, _Component);

  function FindComponent() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FindComponent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FindComponent.__proto__ || Object.getPrototypeOf(FindComponent)).call.apply(_ref, [this].concat(args))), _this), _initDefineProp(_this, 'props', _descriptor, _this), _this.state = {
      fetched: false,
      result: undefined
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(FindComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var query = this.props.query;

      this._find = query.fetch(function (result) {
        var _resultType = t.any();

        t.param('result', _resultType).assert(result);

        if (!_this2._find) return;
        _this2.setState({
          fetched: true,
          result: result
        });
        delete _this2._find;
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._find) {
        // this._find.cancel();
        delete this._find;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _returnType = t.return(t.ref(ReactNodeType));

      if (!this.state.fetched) {
        return _returnType.assert(this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null);
      }

      return _returnType.assert(React.createElement(this.props.component, _defineProperty({}, this.props.name, this.state.result)));
    }
  }]);

  return FindComponent;
}(Component), _class2.propTypes = t.propTypes(PropsType), _temp2), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'props', [_dec], {
  enumerable: true,
  initializer: null
})), _class));
export { FindComponent as default };
//# sourceMappingURL=Find.js.map