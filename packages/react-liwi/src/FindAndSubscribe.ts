import React, { Component, ReactNode, ComponentType } from 'react';
import { BaseModel, Changes } from 'liwi-types';
import { AbstractQuery, AbstractStore } from 'liwi-store';
import applyChanges from './applyChanges';

interface LoadingProps {}

type Record<K extends string, T> = { [P in K]: T };

interface Props<
  Name extends string,
  Model extends BaseModel,
  Store extends AbstractStore<any, any, any, any, any>
> {
  component: ComponentType<Record<Name, Array<Model>>>;
  loadingComponent?: ComponentType<LoadingProps>;
  name: Name;
  query: AbstractQuery<Model, Store>;
}

interface State<Result> {
  fetched: boolean;
  result: Result | undefined;
}

export default class FindAndSubscribeComponent<
  Name extends string,
  Model extends BaseModel,
  Store extends AbstractStore<Model, any, any, any, any>
> extends Component<Props<Name, Model, Store>, State<Array<Model>>> {
  state = {
    fetched: false,
    result: undefined,
  };

  // eslint-disable-next-line react/sort-comp
  _subscribe?: any;

  componentDidMount() {
    const { query } = this.props;
    this._subscribe = query.fetchAndSubscribe(
      (err: Error | null, changes: Changes<Model>) => {
        if (err) {
          // eslint-disable-next-line no-alert
          alert(`Unexpected error: ${err}`);
          return;
        }

        const newResult = applyChanges(
          this.state.result,
          changes,
          query.store.keyPath,
        );

        if (!this.state.fetched) {
          this.setState({ fetched: true, result: newResult });
        } else if (newResult !== this.state.result) {
          this.setState({ result: newResult });
        }
      },
    );
  }

  componentWillUnmount() {
    if (this._subscribe) {
      this._subscribe.stop();
      delete this._subscribe;
    }
  }

  render(): ReactNode {
    if (!this.state.fetched) {
      return this.props.loadingComponent
        ? React.createElement(this.props.loadingComponent)
        : null;
    }

    return React.createElement(this.props.component, {
      [this.props.name]: this.state.result,
    } as any);
  }
}