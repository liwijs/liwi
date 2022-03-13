import type { ReactElement } from 'react';
import indexStyles from 'todomvc-app-css/index.css';
import baseStyles from 'todomvc-common/base.css';
import Info from '../components/Info';
import Main from '../components/Main';
import { NewTaskForm } from '../components/NewTaskForm';
import Paginated from '../components/Paginated';

export function links() {
  return [
    { rel: 'stylesheet', href: baseStyles },
    { rel: 'stylesheet', href: indexStyles },
  ];
}

export default function Index(): ReactElement {
  return (
    <div>
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
    </div>
  );
}
