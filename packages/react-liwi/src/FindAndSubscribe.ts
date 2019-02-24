import React, { Component, ReactNode, ComponentType } from 'react';
import Logger from 'nightingale-logger';
import { Changes } from 'liwi-types';
import { AbstractQuery, SubscribeResult } from 'liwi-store';
import applyChanges from './applyChanges';

interface LoadingProps {}

interface Props<Name extends string, Value, CreateQueryParams> {
  component: ComponentType<{ [P in Name]: Value[] }>;
  loadingComponent?: ComponentType<LoadingProps>;
  name: Name;
  createQuery: (params: CreateQueryParams) => AbstractQuery<Value>;
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
  Value,
  CreateQueryParams
> extends Component<Props<Name, Value, CreateQueryParams>, State<Value[]>> {
  static defaultProps = {
    visibleTimeout: 1000 * 60 * 2, // 2 minutes
  };

  state = {
    fetched: false,
    result: undefined,
  };

  private timeout: number | undefined = undefined;

  private _subscribe: SubscribeResult<Value[]> | undefined = undefined;

  // eslint-disable-next-line react/sort-comp
  private query?: AbstractQuery<Value>;

  componentDidMount() {
    this.query = this.props.createQuery(this.props.params);
    if (!document.hidden) {
      this.subscribe(this.query);
    }
    document.addEventListener(
      'visibilitychange',
      this.handleVisibilityChange,
      false,
    );
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.unsubscribe();
  }

  private handleVisibilityChange = () => {
    if (!document.hidden) {
      if (this.timeout !== undefined) {
        logger.info('timeout cleared', {
          name: this.props.name,
        });
        clearTimeout(this.timeout);
        this.timeout = undefined;
      } else {
        logger.info('resubscribe', {
          name: this.props.name,
        });
        this.subscribe(this.query as AbstractQuery<Value>);
      }
      return;
    }

    if (this._subscribe === undefined) return;

    logger.log('timeout visible', {
      name: this.props.name,
    });
    this.timeout = setTimeout(this.unsubscribe, this.props.visibleTimeout);
  };

  private subscribe = (query: AbstractQuery<Value>): void => {
    this._subscribe = query.fetchAndSubscribe(
      (err: Error | null, changes: Changes<Value>) => {
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

  private unsubscribe = (): void => {
    logger.log('unsubscribe due to timeout visible', {
      name: this.props.name,
    });

    // reset timeout to allow resubscribing
    this.timeout = undefined;

    if (this._subscribe) {
      this._subscribe.stop();
      this._subscribe = undefined;
    }
  };

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
