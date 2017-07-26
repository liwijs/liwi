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
    const { query } = this.props;
    this._find = query.fetch(result => {
      if (!this._find) return;
      this.setState({
        fetched: true,
        result
      });
      delete this._find;
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