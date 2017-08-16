import React, { Component } from 'react';
let FindComponent = class extends Component {
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
    return this.state.fetched ? React.createElement(this.props.component, { [this.props.name]: this.state.result }) : this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null;
  }
};
export { FindComponent as default };
//# sourceMappingURL=Find.js.map