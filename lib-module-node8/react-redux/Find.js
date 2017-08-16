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
    const { query } = this.props;
    this._find = query.fetch(result => {
      this._find && (this.setState({
        fetched: true,
        result
      }), delete this._find);
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