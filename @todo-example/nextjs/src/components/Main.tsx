/* eslint-disable jsx-a11y/label-has-associated-control */
import type {
  TaskQueryAllParams,
  Task,
  TasksService,
} from '@todo-example/modules';
import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import type { OperationCallWrapper, ResourceResult } from 'react-liwi';
import { TodoList } from './TodoList';

export interface MainProps {
  tasksResourceResult: ResourceResult<Task[], TaskQueryAllParams>;
  clearCompleted: OperationCallWrapper<
    TasksService['operations']['clearCompleted']
  >;
  patchTask: OperationCallWrapper<TasksService['operations']['patch']>;
}

export default function Main({
  tasksResourceResult,
  clearCompleted,
  patchTask,
}: MainProps): ReactElement | null {
  const [hash, setHash] = useState(
    typeof window === 'undefined' ? '#/' : window.location.hash,
  );

  const activeTasks = useMemo(() => {
    if (!tasksResourceResult.data) return [];
    return tasksResourceResult.data.filter((task) => !task.completed);
  }, [tasksResourceResult.data]);

  const completedTasks = useMemo(() => {
    if (!tasksResourceResult.data) return [];
    return tasksResourceResult.data.filter((task) => task.completed);
  }, [tasksResourceResult.data]);

  const tasksToShow = useMemo((): Task[] => {
    switch (hash) {
      case '#/active':
        return activeTasks;
      case '#/completed':
        return completedTasks;
      default:
        return tasksResourceResult.data || [];
    }
  }, [activeTasks, completedTasks, hash, tasksResourceResult.data]);

  return tasksResourceResult.initialLoading ? null : (
    <>
      <section className="main">
        <input id="toggle-all" className="toggle-all" type="checkbox" />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <TodoList tasks={tasksToShow} patchTask={patchTask} />
      </section>
      <footer className="footer">
        {activeTasks.length === 0 ? (
          <span className="todo-count">
            <strong>{activeTasks.length}</strong> item left
          </span>
        ) : null}

        {/* <!-- Remove this if you don't implement routing --> */}
        <ul className="filters">
          <li>
            <a
              className={hash === '#/' ? 'selected' : ''}
              href="#/"
              onClick={() => {
                setHash('#/');
              }}
            >
              All
            </a>
          </li>
          <li>
            <a
              className={hash === '#/active' ? 'selected' : ''}
              href="#/active"
              onClick={() => {
                setHash('#/active');
              }}
            >
              Active
            </a>
          </li>
          <li>
            <a
              className={hash === '#/completed' ? 'selected' : ''}
              href="#/completed"
              onClick={() => {
                setHash('#/completed');
              }}
            >
              Completed
            </a>
          </li>
        </ul>
        {/* <!-- Hidden if no completed items are left ↓ --> */}
        {completedTasks.length === 0 ? null : (
          <button
            type="button"
            className="clear-completed"
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              clearCompleted();
            }}
          >
            Clear completed
          </button>
        )}
      </footer>
    </>
  );
}
