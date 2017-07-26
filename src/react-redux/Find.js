import React, { Component } from 'react';
import type { ReactNodeType, ReactComponentType } from 'alp-react-redux/src/types';
import AbstractQuery from '../store/AbstractQuery';

type PropsType = {
  name: string,
  query: AbstractQuery,
  component: ReactComponentType,
  loadingComponent: ?ReactComponentType,
};

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

  render(): ReactNodeType {
    if (!this.state.fetched) {
      return this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null;
    }

    return React.createElement(this.props.component, { [this.props.name]: this.state.result });
  }
}
