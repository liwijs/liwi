/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable complexity */
import type { Task } from '@todo-example/modules';
import type { ReactElement } from 'react';
import { useContext, useMemo, useState } from 'react';
import { useResource, useOperation } from 'react-liwi';
import { TodoServicesContext } from 'app/services/TodoServicesProvider';
import { TodoList } from './TodoList';

export default function Main(): ReactElement | null {
  const todoServices = useContext(TodoServicesContext);
  const tasksResourceResult = useResource(
    todoServices.tasksService.queries.queryAll,
    {
      params: {
        limit: 200,
        page: 1,
      },
      subscribe: true,
    },
    [],
  );

  const [hash, setHash] = useState(
    typeof window === 'undefined' ? '#/' : window.location.hash,
  );

  const [clearCompleted] = useOperation(
    todoServices.tasksService.operations.clearCompleted,
  );
  const [patchTask] = useOperation(todoServices.tasksService.operations.patch);

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
        return !tasksResourceResult.data ? [] : tasksResourceResult.data;
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
            onClick={() => clearCompleted()}
          >
            Clear completed
          </button>
        )}
      </footer>
    </>
  );
}
