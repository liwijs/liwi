import React, { Component } from 'react';
let FindComponent = class extends Component {
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
    if (!this.state.fetched) {
      return this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null;
    }

    return React.createElement(this.props.component, { [this.props.name]: this.state.result });
  }
};
export { FindComponent as default };
//# sourceMappingURL=Find.js.map