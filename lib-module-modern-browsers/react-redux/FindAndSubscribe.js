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
    var _this = this;

    const { query } = this.props;
    this._subscribe = query.fetchAndSubscribe(function (err, change) {
      if (err) return void alert(`Unexpected error: ${err}`);

      const newResult = applyChange(_this.state.result, change);

      _this.state.fetched ? newResult !== _this.state.result && _this.setState({ result: newResult }) : _this.setState({ fetched: true, result: newResult });
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