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
      if (err) {
        // eslint-disable-next-line no-alert
        alert(`Unexpected error: ${err}`);
        return;
      }

      const newResult = applyChange(_this.state.result, change);

      if (!_this.state.fetched) {
        _this.setState({ fetched: true, result: newResult });
      } else if (newResult !== _this.state.result) {
        _this.setState({ result: newResult });
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
    if (!this.state.fetched) {
      return this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null;
    }

    return React.createElement(this.props.component, { [this.props.name]: this.state.result });
  }
};
export { FindAndSubscribeComponent as default };
//# sourceMappingURL=FindAndSubscribe.js.map