import { AlpModule } from 'alp-react';
import type { ReactElement } from 'react';
import React from 'react';
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
