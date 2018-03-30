import React, { Component, type Node, type ComponentType } from 'react';
import { AbstractQuery } from 'liwi-store';

type PropsType = {|
  component: ComponentType,
  loadingComponent?: ?ComponentType,
  name: string,
  query: AbstractQuery,
|};

export default class FindComponent extends Component {
  props: PropsType;

  state = {
    fetched: false,
    result: undefined,
  };

  componentDidMount() {
    const { query } = this.props;
    this._find = query.fetch((result: any) => {
      if (!this._find) return;
      this.setState({
        fetched: true,
        result,
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

  render(): Node {
    if (!this.state.fetched) {
      return this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null;
    }

    return React.createElement(this.props.component, { [this.props.name]: this.state.result });
  }
}
