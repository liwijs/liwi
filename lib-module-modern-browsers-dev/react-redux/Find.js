var _class, _temp2;

import React, { Component } from 'react';
import { ReactNodeType as _ReactNodeType, ReactComponentType as _ReactComponentType } from 'alp-react-redux/types';
import AbstractQuery from '../store/AbstractQuery';

import t from 'flow-runtime';
const ReactNodeType = t.tdz(function () {
  return _ReactNodeType;
});
const ReactComponentType = t.tdz(function () {
  return _ReactComponentType;
});
const PropsType = t.type('PropsType', t.object(t.property('name', t.string()), t.property('query', t.ref(AbstractQuery)), t.property('component', t.ref(ReactComponentType)), t.property('loadingComponent', t.nullable(t.ref(ReactComponentType)))));
let FindComponent = (_temp2 = _class = class extends Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = {
      fetched: false,
      result: void 0
    }, _temp;
  }

  componentDidMount() {
    var _this = this;

    const { query } = this.props;
    this._find = query.fetch(function (result) {
      let _resultType = t.any();

      t.param('result', _resultType).assert(result);
      _this._find && (_this.setState({
        fetched: true,
        result
      }), delete _this._find);
    });
  }

  componentWillUnmount() {
    this._find && delete this._find;
  }

  render() {
    const _returnType = t.return(t.ref(ReactNodeType));

    return this.state.fetched ? _returnType.assert(React.createElement(this.props.component, { [this.props.name]: this.state.result })) : _returnType.assert(this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null);
  }
}, _class.propTypes = t.propTypes(PropsType), _temp2);
export { FindComponent as default };
//# sourceMappingURL=Find.js.map