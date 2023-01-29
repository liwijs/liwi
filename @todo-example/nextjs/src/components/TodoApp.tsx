import Head from 'next/head';
import type { ReactElement } from 'react';
import Info from './Info';
import type { MainProps } from './Main';
import Main from './Main';
import type { NewTaskFormProps } from './NewTaskForm';
import { NewTaskForm } from './NewTaskForm';
import Paginated from './Paginated';

export interface TodoAppProps {
  versionName: string;
  isReady: boolean;
  isTaskCreating: NewTaskFormProps['isTaskCreating'];
  createTask: NewTaskFormProps['createTask'];
  tasksResourceResult: MainProps['tasksResourceResult'];
  clearCompleted: MainProps['clearCompleted'];
  patchTask: MainProps['patchTask'];
}

export function TodoApp({
  versionName,
  isReady,
  isTaskCreating,
  createTask,
  tasksResourceResult,
  clearCompleted,
  patchTask,
}: TodoAppProps): ReactElement {
  return (
    <>
      <section className="todoapp">
        <Head>
          <title>Todo App with liwi</title>
          <meta
            name="description"
            content={`Todo App with liwi - version ${versionName}`}
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <header className="header">
          <h1>todos</h1>
          <NewTaskForm
            isReady={isReady}
            isTaskCreating={isTaskCreating}
            createTask={createTask}
          />
        </header>
        <Main
          tasksResourceResult={tasksResourceResult}
          clearCompleted={clearCompleted}
          patchTask={patchTask}
        />
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
