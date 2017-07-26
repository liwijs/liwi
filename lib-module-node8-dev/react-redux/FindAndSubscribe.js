var _class, _temp2;

import React, { Component } from 'react';
import { ReactNodeType as _ReactNodeType, ReactComponentType as _ReactComponentType } from 'alp-react-redux/types';
import _AbstractQuery from '../store/AbstractQuery';
import applyChange from './applyChange';

import t from 'flow-runtime';
const AbstractQuery = t.tdz(() => _AbstractQuery);
const ReactNodeType = t.tdz(() => _ReactNodeType);
const ReactComponentType = t.tdz(() => _ReactComponentType);
const PropsType = t.type('PropsType', t.object(t.property('name', t.string()), t.property('query', t.ref(AbstractQuery)), t.property('component', t.ref(ReactComponentType)), t.property('loadingComponent', t.nullable(t.ref(ReactComponentType)))));
let FindAndSubscribeComponent = (_temp2 = _class = class extends Component {
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
      if (err) {
        // eslint-disable-next-line no-alert
        alert(`Unexpected error: ${err}`);
        return;
      }

      const newResult = applyChange(this.state.result, change);

      if (!this.state.fetched) {
        this.setState({ fetched: true, result: newResult });
      } else if (newResult !== this.state.result) {
        this.setState({ result: newResult });
      }
    });
  }

  componentWillUnmount() {
    if (this._subscribe) {
      this._subscribe.stop();
      delete this._subscribe;
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
export { FindAndSubscribeComponent as default };
//# sourceMappingURL=FindAndSubscribe.js.map