/* eslint-disable unicorn/no-nested-ternary */
import React, { useContext, ReactElement, useState } from 'react';
import { usePaginatedResource } from 'react-liwi';
import { TodoServicesContext } from 'web/todo/services/TodoServicesProvider';

interface PaginatedProps {
  subscribe: boolean;
}

export default function Paginated({
  subscribe,
}: PaginatedProps): ReactElement | null {
  const [completed, setCompleted] = useState(false);
  const [page, setPage] = useState(1);

  const todoServices = useContext(TodoServicesContext);
  const tasksResourceResult = usePaginatedResource(
    todoServices.tasksService.queries.queryAll,
    {
      params: {
        completed,
        limit: 3,
        page,
      },
      subscribe,
    },
    [completed, page],
  );

  return (
    <>
      <div>
        Select:
        <select
          defaultValue="active"
          onChange={(e) => setCompleted(e.target.value === 'completed')}
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {tasksResourceResult.initialLoading ? (
        'Loading...'
      ) : tasksResourceResult.initialError ? (
        'Error!'
      ) : (
        <>
          {tasksResourceResult.error ? <b>Error!</b> : null}
          <ul>
            {tasksResourceResult.data.map((task) => (
              <li key={task._id}>{task.label}</li>
            ))}
          </ul>
          Total: {tasksResourceResult.meta.total} ; Page: {page}
          {tasksResourceResult.pagination.totalPages > 1 ? (
            <div>
              {new Array(tasksResourceResult.pagination.totalPages)
                .fill(null)
                .map((v, i) => {
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <span key={i}>
                      <button type="button" onClick={() => setPage(i + 1)}>
                        {i + 1}
                      </button>{' '}
                    </span>
                  );
                })}
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
