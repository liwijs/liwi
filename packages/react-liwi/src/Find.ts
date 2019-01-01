import React, { Component, ReactNode, ComponentType } from 'react';
import { AbstractQuery, AbstractStore } from 'liwi-store';
import { BaseModel } from 'liwi-types';

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

export default class FindComponent<
  Name extends string,
  Model extends BaseModel,
  Store extends AbstractStore<any, any, any, any, any>
> extends Component<Props<Name, Model, Store>, State<Array<Model>>> {
  state = {
    fetched: false,
    result: undefined,
  };

  // eslint-disable-next-line react/sort-comp
  _find?: Promise<void>;

  componentDidMount() {
    const { query } = this.props;
    this._find = query.fetch((result: Array<Model>) => {
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
