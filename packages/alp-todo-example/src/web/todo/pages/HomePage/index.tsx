/* eslint-disable jsx-a11y/no-autofocus */
import type { ReactElement } from 'react';
import React from 'react';
import Info from './components/Info';
import Main from './components/Main';
import { NewTaskForm } from './components/NewTaskForm';
import Paginated from './components/Paginated';

export default function IndexView(): ReactElement {
  return (
    <>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <NewTaskForm />
        </header>
        <Main />
      </section>
      <Info />

      <div style={{ display: 'flex' }}>
        <div style={{ flex: '0 0 50%' }}>
          Version subscribe=true
          <Paginated subscribe />
        </div>
        <div style={{ flex: '0 0 50%' }}>
          Version subscribe=false
          <Paginated subscribe={false} />
        </div>
      </div>
    </>
  );
}
