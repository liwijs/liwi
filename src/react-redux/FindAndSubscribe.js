import React, { Component } from 'react';
import type { ReactNodeType, ReactComponentType } from 'alp-react-redux/types';
import type AbstractQuery from '../store/AbstractQuery';
import applyChange from './applyChange';

type PropsType = {|
  name: string,
  query: AbstractQuery,
  component: ReactComponentType,
  loadingComponent?: ?ReactComponentType,
|};

export default class FindAndSubscribeComponent extends Component {
  props: PropsType;

  state = {
    fetched: false,
    result: [],
  };

  componentDidMount() {
    const { query } = this.props;
    this._subscribe = query.fetchAndSubscribe((err, change) => {
      if (err) {
        // eslint-disable-next-line no-alert
        alert(`Unexpected error: ${err}`);
        return;
      }

      const newResult = applyChange(this.state.result, change);

      if (!this.state.fetched) {
        this.setState({ fetched: true, result: newResult });
      } else if (newResult !== this.state.result) {
        this.setState({ result: newResult });
      }
    });
  }

  componentWillUnmount() {
    if (this._subscribe) {
      this._subscribe.stop();
      delete this._subscribe;
    }
  }

  render(): ReactNodeType {
    if (!this.state.fetched) {
      return this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null;
    }

    return React.createElement(this.props.component, { [this.props.name]: this.state.result });
  }
}
