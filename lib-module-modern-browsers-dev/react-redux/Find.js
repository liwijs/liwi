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
const PropsType = t.type('PropsType', t.exactObject(t.property('name', t.string()), t.property('query', t.ref(AbstractQuery)), t.property('component', t.ref(ReactComponentType)), t.property('loadingComponent', t.nullable(t.ref(ReactComponentType)), true)));
let FindComponent = (_temp2 = _class = class extends Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = {
      fetched: false,
      result: undefined
    }, _temp;
  }

  componentDidMount() {
    var _this = this;

    const { query } = this.props;
    this._find = query.fetch(function (result) {
      let _resultType = t.any();

      t.param('result', _resultType).assert(result);

      if (!_this._find) return;
      _this.setState({
        fetched: true,
        result
      });
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

    if (!this.state.fetched) {
      return _returnType.assert(this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null);
    }

    return _returnType.assert(React.createElement(this.props.component, { [this.props.name]: this.state.result }));
  }
}, _class.propTypes = t.propTypes(PropsType), _temp2);
export { FindComponent as default };
//# sourceMappingURL=Find.js.map