import React, { Component, ReactNode, ComponentType } from 'react';
import Logger from 'nightingale-logger';
import { BaseModel, Changes } from 'liwi-types';
import { AbstractQuery, SubscribeResult } from 'liwi-store';
import applyChanges from './applyChanges';

interface LoadingProps {}

interface Props<Name extends string, Model extends BaseModel> {
  component: ComponentType<{ [P in Name]: Model[] }>;
  loadingComponent?: ComponentType<LoadingProps>;
  name: Name;
  query: AbstractQuery<Model>;
  visibleTimeout?: number;
}

interface State<Result> {
  fetched: boolean;
  result: Result | undefined;
}

const logger = new Logger('react-liwi:FindAndSubscribe');

export default class FindAndSubscribeComponent<
  Name extends string,
  Model extends BaseModel
> extends Component<Props<Name, Model>, State<Model[]>> {
  static defaultProps = {
    visibleTimeout: 1000 * 60 * 2, // 2 minutes
  };

  state = {
    fetched: false,
    result: undefined,
  };

  private timeout: number | undefined = undefined;

  private _subscribe: SubscribeResult | undefined = undefined;

  componentDidMount() {
    this.subscribe();
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
        this.subscribe();
      }
      return;
    }

    if (this._subscribe === undefined) return;

    logger.log('timeout visible', {
      name: this.props.name,
    });
    this.timeout = setTimeout(this.unsubscribe, this.props.visibleTimeout);
  };

  private subscribe = (): void => {
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
