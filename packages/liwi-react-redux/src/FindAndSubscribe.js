import React, { Component, type Node, type ComponentType } from 'react';
import { AbstractQuery } from 'liwi-store';
import applyChange from './applyChange';

type Props = {|
  component: ComponentType,
  loadingComponent?: ?ComponentType,
  name: string,
  query: AbstractQuery,
|};

type State = {|
  fetched: boolean,
  result: Array<any>,
|};

export default class FindAndSubscribeComponent extends Component<Props, State> {
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

  render(): Node {
    if (!this.state.fetched) {
      return this.props.loadingComponent ? React.createElement(this.props.loadingComponent) : null;
    }

    return React.createElement(this.props.component, { [this.props.name]: this.state.result });
  }
}
