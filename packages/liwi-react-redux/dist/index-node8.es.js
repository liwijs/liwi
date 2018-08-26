import React, { Component } from 'react';

class FindComponent extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      fetched: false,
      result: undefined
    };
    this._find = void 0;
  }

  componentDidMount() {
    const {
      query
    } = this.props;
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

    return React.createElement(this.props.component, {
      [this.props.name]: this.state.result
    });
  }

}

// export { default as FindAndSubscribe } from './FindAndSubscribe';

export { FindComponent as Find };
//# sourceMappingURL=index-node8.es.js.map
