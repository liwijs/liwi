import React, { Component, ReactNode, ComponentType } from 'react';
import Logger from 'nightingale-logger';
import { BaseModel, Changes } from 'liwi-types';
import { AbstractQuery, SubscribeResult } from 'liwi-store';
import applyChanges from './applyChanges';

interface LoadingProps {}

interface Props<
  Name extends string,
  Model extends BaseModel,
  CreateQueryParams
> {
  component: ComponentType<{ [P in Name]: Model[] }>;
  loadingComponent?: ComponentType<LoadingProps>;
  name: Name;
  createQuery: (params: CreateQueryParams) => AbstractQuery<Model>;
  params: CreateQueryParams;
  visibleTimeout?: number;
}

interface State<Result> {
  fetched: boolean;
  result: Result | undefined;
}

const logger = new Logger('react-liwi:FindAndSubscribe');

export default class FindAndSubscribeComponent<
  Name extends string,
  Model extends BaseModel,
  CreateQueryParams
> extends Component<Props<Name, Model, CreateQueryParams>, State<Model[]>> {
  static defaultProps = {
    visibleTimeout: 1000 * 60 * 2, // 2 minutes
  };

  state = {
    fetched: false,
    result: undefined,
  };

  private timeout: number | undefined = undefined;

  private _subscribe: SubscribeResult<Model[]> | undefined = undefined;

  // eslint-disable-next-line react/sort-comp
  private query?: AbstractQuery<Model>;

  componentDidMount() {
    this.query = this.props.createQuery(this.props.params);
    this.subscribe(this.query);
    document.addEventListener(
      'visibilitychange',
      this.handleVisibilityChange,
      false,
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  private handleVisibilityChange = () => {
    if (!document.hidden) {
      if (this.timeout !== undefined) {
        logger.log('timeout cleared', {
          name: this.props.name,
        });
        clearTimeout(this.timeout);
        this.timeout = undefined;
      } else {
        logger.debug('resubscribe', {
          name: this.props.name,
        });
        this.subscribe(this.query as AbstractQuery<Model>);
      }
      return;
    }

    if (this._subscribe === undefined) return;

    logger.log('timeout visible', {
      name: this.props.name,
    });
    this.timeout = setTimeout(this.unsubscribe, this.props.visibleTimeout);
  };

  private subscribe = (query: AbstractQuery<Model>): void => {
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
          '_id', // TODO get keyPath from client(/store)
        );

        if (!this.state.fetched) {
          this.setState({ fetched: true, result: newResult });
        } else if (newResult !== this.state.result) {
          this.setState({ result: newResult });
        }
      },
    );
  };

  private unsubscribe(): void {
    logger.log('unsubscribe due to timeout visible', {
      name: this.props.name,
    });

    if (this._subscribe) {
      this._subscribe.stop();
      this._subscribe = undefined;
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
