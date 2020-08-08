import React, { ReactElement, Component, ErrorInfo } from 'react';
import TodoModule from '../todo/TodoModule';
import ErrorPage from './ErrorPage';

interface AppProps {}

interface AppState {
  hasError: boolean;
}

export default class App extends Component<AppProps, AppState> {
  static getDerivedStateFromError(): AppState {
    return { hasError: true };
  }

  state = {
    hasError: false,
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  render(): ReactElement {
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

    return <TodoModule />;
  }
}
