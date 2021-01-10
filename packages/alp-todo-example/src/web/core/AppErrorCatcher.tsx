import type { ErrorInfo, ReactNode } from 'react';
import React, { Component } from 'react';
import ErrorPage from './ErrorPage';

interface AppErrorCatcherProps {
  children: NonNullable<ReactNode>;
}

interface AppErrorCatcherState {
  hasError: boolean;
}

export default class AppErrorCatcher extends Component<
  AppErrorCatcherProps,
  AppErrorCatcherState
> {
  static getDerivedStateFromError(): AppErrorCatcherState {
    return { hasError: true };
  }

  state = {
    hasError: false,
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorPage
          onRetryClick={(): void => {
            this.setState({
              hasError: false,
            });
          }}
        />
      );
    }

    return this.props.children;
  }
}
