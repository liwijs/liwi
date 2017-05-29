var _dec, _desc, _value, _class, _descriptor, _class2, _temp2;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

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

import { Component } from 'react';
import PropTypes from 'prop-types';
import { ReactNodeType as _ReactNodeType, ReduxDispatchType as _ReduxDispatchType } from 'alp-react-redux/types';
import AbstractQuery from '../store/AbstractQuery';

import t from 'flow-runtime';
const ReactNodeType = t.tdz(function () {
  return _ReactNodeType;
});
const ReduxDispatchType = t.tdz(function () {
  return _ReduxDispatchType;
});
const ActionType = t.type('ActionType', t.function(t.param('result', t.any()), t.return(t.any())));
const PropsType = t.type('PropsType', t.object(t.property('dispatch', t.nullable(t.ref(ReduxDispatchType))), t.property('action', ActionType), t.property('query', t.ref(AbstractQuery)), t.property('children', t.ref(ReactNodeType))));
let FindComponent = (_dec = t.decorate(PropsType), (_class = (_temp2 = _class2 = class extends Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), _initDefineProp(this, 'props', _descriptor, this), _temp;
  }

  componentDidMount() {
    var _this = this;

    const { query, action } = this.props;
    const dispatch = this.props.dispatch || this.context.store.dispatch;
    this._find = query.fetch(function (result) {
      let _resultType = t.any();

      t.param('result', _resultType).assert(result);

      if (!_this._find) return;
      dispatch(action(result));
      delete _this._find;
    });
  }

  componentWillUnmount() {
    if (this._find) {
      // this._find.cancel();
      delete this._find;
    }
  }

  render() {
    const _returnType = t.return(t.ref(ReactNodeType));

    return _returnType.assert(this.props.children);
  }
}, _class2.propTypes = t.propTypes(PropsType), _class2.contextTypes = {
  store: PropTypes.any
}, _temp2), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'props', [_dec], {
  enumerable: true,
  initializer: null
})), _class));
export { FindComponent as default };
//# sourceMappingURL=Find.js.map