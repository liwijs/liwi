import React, { Component } from 'react';

import applyChange from './applyChange';

let FindAndSubscribeComponent = class extends Component {
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

      const newResult = applyChange(this.state.result, change);

      this.state.fetched ? newResult !== this.state.result && this.setState({ result: newResult }) : this.setState({ fetched: true, result: newResult });
    });
  }

  componentWillUnmount() {
    this._subscribe && (this._subscribe.stop(), delete this._subscribe);
  }

  render() {
    return this.state.fetched ? React.createElement(this.props.component, { [this.props.name]: this.state.result }) : this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null;
  }
};
export { FindAndSubscribeComponent as default };
//# sourceMappingURL=FindAndSubscribe.js.map