import { AlpModule } from 'alp-react';
import React, { ReactElement } from 'react';
import HomePage from './pages/HomePage';
import TodoServicesProvider from './services/TodoServicesProvider';

export default function TodoModule(): ReactElement {
  return (
    <TodoServicesProvider>
      <AlpModule>
        <HomePage />
      </AlpModule>
    </TodoServicesProvider>
  );
}
