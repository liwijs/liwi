import React, { ReactElement } from 'react';
import TodoModule from '../todo/TodoModule';
import AppErrorCatcher from './AppErrorCatcher';

interface AppProps {}

export default function App(props: AppProps): ReactElement {
  return (
    <AppErrorCatcher>
      <TodoModule />
    </AppErrorCatcher>
  );
}
